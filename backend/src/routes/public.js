import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query, withTransaction } from '../db.js';
import { optionalCustomer, requireAdmin, signToken } from '../auth.js';
import { createPaymentForOrder } from '../payments.js';
import { parseMoney, publicSettings, toInt, wrap } from '../helpers.js';

const router = Router();

const PRODUCT_COLUMNS = `p.id, p.name, p.slug, p.brand, p.short_desc, p.description, p.ingredients,
  p.how_to_use, p.price, p.compare_price, p.stock, p.sku, p.volume, p.skin_type, p.images,
  p.specs, p.is_active, p.is_featured, p.is_bestseller, p.rating, p.sold, p.views, p.created_at`;

function shapeProduct(row) {
  if (!row) return null;
  return {
    ...row,
    price: Number(row.price),
    compare_price: Number(row.compare_price || 0),
    stock: Number(row.stock),
    sold: Number(row.sold || 0),
    rating: Number(row.rating || 0),
    images: Array.isArray(row.images) ? row.images : [],
    specs: Array.isArray(row.specs) ? row.specs : [],
  };
}

async function getCategoryTree() {
  const { rows } = await query(
    `SELECT c.*, (SELECT COUNT(*)::int FROM products p WHERE p.category_id = c.id AND p.is_active) AS product_count
     FROM categories c ORDER BY c.sort_order, c.id`
  );
  const parents = rows.filter((c) => !c.parent_id);
  return parents.map((parent) => {
    const children = rows.filter((c) => c.parent_id === parent.id);
    const childCount = children.reduce((sum, child) => sum + Number(child.product_count || 0), 0);
    return {
      ...parent,
      product_count: Number(parent.product_count || 0) + childCount,
      children,
    };
  });
}

router.get('/health', wrap(async (req, res) => {
  const started = Date.now();
  await query('SELECT 1');
  res.json({
    ok: true,
    service: 'senz-api',
    db: process.env.USE_PGLITE === '1' ? 'pglite' : 'postgresql',
    latency_ms: Date.now() - started,
    time: new Date().toISOString(),
  });
}));

router.get('/settings', wrap(async (req, res) => {
  const { rows } = await query('SELECT key, value FROM settings');
  res.json(publicSettings(rows));
}));

router.get('/categories', wrap(async (req, res) => {
  res.json(await getCategoryTree());
}));

router.get('/brands', wrap(async (req, res) => {
  const { rows } = await query(
    `SELECT b.id, b.name, b.latin, b.logo, b.image, b.sort_order, b.is_featured,
            (SELECT COUNT(*)::int FROM products p
              WHERE p.is_active = true AND TRIM(p.brand) = b.name) AS count
       FROM brands b
      WHERE b.is_active = true
      ORDER BY b.sort_order, b.id`
  );
  res.json({ brands: rows });
}));

router.get('/products', wrap(async (req, res) => {
  const {
    category,
    q,
    sort = 'newest',
    min_price,
    max_price,
    featured,
    bestseller,
    on_sale,
    skin_type,
    page = 1,
    limit = 12,
  } = req.query;

  const where = ['p.is_active = true'];
  const params = [];

  if (category) {
    params.push(category);
    where.push(`p.category_id IN (
      WITH RECURSIVE cat AS (
        SELECT id FROM categories WHERE slug = $${params.length}
        UNION ALL
        SELECT c.id FROM categories c JOIN cat ON c.parent_id = cat.id
      ) SELECT id FROM cat
    )`);
  }
  if (q) {
    params.push(`%${String(q).trim()}%`);
    where.push(`(p.name ILIKE $${params.length} OR p.short_desc ILIKE $${params.length}
      OR p.brand ILIKE $${params.length} OR p.ingredients ILIKE $${params.length})`);
  }
  if (min_price) {
    params.push(toInt(min_price));
    where.push(`p.price >= $${params.length}`);
  }
  if (max_price) {
    params.push(toInt(max_price));
    where.push(`p.price <= $${params.length}`);
  }
  if (featured === '1' || featured === 'true') where.push('p.is_featured = true');
  if (bestseller === '1' || bestseller === 'true') where.push('p.is_bestseller = true');
  if (on_sale === '1' || on_sale === 'true') where.push('p.compare_price > p.price');
  if (skin_type) {
    params.push(`%${skin_type}%`);
    where.push(`p.skin_type ILIKE $${params.length}`);
  }

  const sortMap = {
    newest: 'p.created_at DESC, p.id DESC',
    cheapest: 'p.price ASC',
    expensive: 'p.price DESC',
    popular: 'p.sold DESC, p.views DESC',
    rating: 'p.rating DESC',
    discount: '(p.compare_price - p.price) DESC',
  };
  const orderBy = sortMap[sort] || sortMap.newest;

  const perPage = Math.min(Math.max(toInt(limit, 12), 1), 60);
  const currentPage = Math.max(toInt(page, 1), 1);
  const offset = (currentPage - 1) * perPage;

  const countSql = `SELECT COUNT(*)::int AS total FROM products p WHERE ${where.join(' AND ')}`;
  const listSql = `
    SELECT ${PRODUCT_COLUMNS}, c.name AS category_name, c.slug AS category_slug
    FROM products p LEFT JOIN categories c ON c.id = p.category_id
    WHERE ${where.join(' AND ')}
    ORDER BY ${orderBy}
    LIMIT ${perPage} OFFSET ${offset}`;

  const [{ rows: countRows }, { rows }] = await Promise.all([
    query(countSql, params),
    query(listSql, params),
  ]);

  const total = countRows[0].total;
  res.json({
    items: rows.map(shapeProduct),
    total,
    page: currentPage,
    pages: Math.max(Math.ceil(total / perPage), 1),
    limit: perPage,
  });
}));

router.get('/products/:slug', wrap(async (req, res) => {
  const { rows } = await query(
    `SELECT ${PRODUCT_COLUMNS}, c.name AS category_name, c.slug AS category_slug,
            c.parent_id AS category_parent_id
     FROM products p LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.slug = $1 AND p.is_active = true`,
    [req.params.slug]
  );
  if (!rows.length) return res.status(404).json({ error: 'محصول یافت نشد.' });
  const product = shapeProduct(rows[0]);

  await query('UPDATE products SET views = views + 1 WHERE id = $1', [product.id]);

  const [related, reviews] = await Promise.all([
    query(
      `SELECT ${PRODUCT_COLUMNS} FROM products p
       WHERE p.is_active = true AND p.id <> $1 AND ($2::int IS NULL OR p.category_id = $2::int)
       ORDER BY p.sold DESC LIMIT 4`,
      [product.id, product.category_id]
    ),
    query(
      `SELECT id, name, rating, comment, created_at FROM reviews
       WHERE product_id = $1 AND is_approved = true ORDER BY created_at DESC LIMIT 20`,
      [product.id]
    ),
  ]);

  res.json({
    product,
    related: related.rows.map(shapeProduct),
    reviews: reviews.rows,
  });
}));

router.get('/products/:slug/reviews', wrap(async (req, res) => {
  const { rows } = await query(
    `SELECT r.id, r.name, r.rating, r.comment, r.created_at FROM reviews r
     JOIN products p ON p.id = r.product_id
     WHERE p.slug = $1 AND r.is_approved = true ORDER BY r.created_at DESC`,
    [req.params.slug]
  );
  res.json(rows);
}));

router.post('/products/:slug/reviews', wrap(async (req, res) => {
  const { name, rating, comment } = req.body || {};
  if (!name || !comment) return res.status(400).json({ error: 'نام و متن نظر الزامی است.' });
  const { rows: prod } = await query('SELECT id FROM products WHERE slug = $1', [req.params.slug]);
  if (!prod.length) return res.status(404).json({ error: 'محصول یافت نشد.' });
  await query(
    `INSERT INTO reviews (product_id, name, rating, comment, is_approved)
     VALUES ($1, $2, $3, $4, false)`,
    [prod[0].id, String(name).slice(0, 80), Math.min(Math.max(toInt(rating, 5), 1), 5), String(comment).slice(0, 1500)]
  );
  res.status(201).json({ ok: true, message: 'نظر شما ثبت شد و پس از تأیید نمایش داده می‌شود.' });
}));

router.get('/banners', wrap(async (req, res) => {
  const placement = req.query.placement || 'hero';
  const { rows } = await query(
    'SELECT * FROM banners WHERE is_active = true AND placement = $1 ORDER BY sort_order, id',
    [placement]
  );
  res.json(rows);
}));

router.get('/posts', wrap(async (req, res) => {
  const { rows } = await query(
    `SELECT id, title, slug, excerpt, cover, author, created_at FROM posts
     WHERE is_published = true ORDER BY created_at DESC`
  );
  res.json(rows);
}));

router.get('/posts/:slug', wrap(async (req, res) => {
  const { rows } = await query(
    'SELECT * FROM posts WHERE slug = $1 AND is_published = true',
    [req.params.slug]
  );
  if (!rows.length) return res.status(404).json({ error: 'مقاله یافت نشد.' });
  const latest = await query(
    `SELECT id, title, slug, cover, created_at FROM posts
     WHERE is_published = true AND slug <> $1 ORDER BY created_at DESC LIMIT 3`,
    [req.params.slug]
  );
  res.json({ post: rows[0], related: latest.rows });
}));

router.get('/home', wrap(async (req, res) => {
  const [banners, categories, featured, bestsellers, newest, posts, settings] = await Promise.all([
    query("SELECT * FROM banners WHERE is_active = true AND placement = 'hero' ORDER BY sort_order, id"),
    getCategoryTree(),
    query(
      `SELECT ${PRODUCT_COLUMNS} FROM products p WHERE p.is_active AND p.is_featured ORDER BY p.sold DESC LIMIT 8`
    ),
    query(
      `SELECT ${PRODUCT_COLUMNS} FROM products p WHERE p.is_active AND p.is_bestseller ORDER BY p.sold DESC LIMIT 8`
    ),
    query(
      `SELECT ${PRODUCT_COLUMNS} FROM products p WHERE p.is_active ORDER BY p.created_at DESC LIMIT 8`
    ),
    query(
      `SELECT id, title, slug, excerpt, cover, created_at FROM posts WHERE is_published ORDER BY created_at DESC LIMIT 3`
    ),
    query('SELECT key, value FROM settings'),
  ]);

  res.json({
    banners: banners.rows,
    categories,
    featured: featured.rows.map(shapeProduct),
    bestsellers: bestsellers.rows.map(shapeProduct),
    newest: newest.rows.map(shapeProduct),
    posts: posts.rows,
    settings: publicSettings(settings.rows),
  });
}));

router.post('/coupons/validate', wrap(async (req, res) => {
  const { code, subtotal = 0 } = req.body || {};
  if (!code) return res.status(400).json({ error: 'کد تخفیف را وارد کنید.' });
  const { rows } = await query('SELECT * FROM coupons WHERE upper(code) = upper($1)', [String(code).trim()]);
  const coupon = rows[0];
  if (!coupon || !coupon.is_active) return res.status(400).json({ error: 'کد تخفیف نامعتبر است.' });
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date())
    return res.status(400).json({ error: 'کد تخفیف منقضی شده است.' });
  if (coupon.max_uses > 0 && coupon.used >= coupon.max_uses)
    return res.status(400).json({ error: 'ظرفیت استفاده از این کد تکمیل شده است.' });
  const total = parseMoney(subtotal);
  if (total < coupon.min_total)
    return res.status(400).json({
      error: `حداقل مبلغ سبد برای این کد ${coupon.min_total.toLocaleString('en-US')} تومان است.`,
    });
  const discount = coupon.percent > 0 ? Math.floor((total * coupon.percent) / 100) : coupon.amount;
  res.json({
    code: coupon.code,
    percent: coupon.percent,
    amount: coupon.amount,
    discount: Math.min(discount, total),
    message: 'کد تخفیف اعمال شد.',
  });
}));

router.post('/orders', optionalCustomer, wrap(async (req, res) => {
  const body = req.body || {};
  const items = Array.isArray(body.items) ? body.items : [];
  if (!items.length) return res.status(400).json({ error: 'سبد خرید خالی است.' });

  const required = ['customer_name', 'phone', 'address', 'city'];
  for (const field of required) {
    if (!body[field] || String(body[field]).trim().length < 2)
      return res.status(400).json({ error: 'لطفاً اطلاعات ارسال را کامل وارد کنید.' });
  }
  if (!/^09\d{9}$/.test(String(body.phone).replace(/[^\d]/g, '')))
    return res.status(400).json({ error: 'شماره موبایل معتبر نیست (مثال: ۰۹۱۲۱۲۳۴۵۶۷).' });

  const { rows: settingsRows } = await query('SELECT key, value FROM settings');
  const settings = publicSettings(settingsRows);

  const requestedPayment = ['cod', 'card', 'online'].includes(body.payment_method)
    ? body.payment_method
    : 'cod';
  if (requestedPayment === 'online' && !settings.payment_online_enabled) {
    return res.status(400).json({ error: 'پرداخت آنلاین در حال حاضر فعال نیست. لطفاً روش دیگری انتخاب کنید.' });
  }
  const shippingBase = Number(settings.shipping_cost || 0);
  const freeOver = Number(settings.free_shipping_min || 0);

  const result = await withTransaction(async (tx) => {
    const ids = [...new Set(items.map((i) => toInt(i.product_id)))].filter(Boolean);
    if (!ids.length) {
      const err = new Error('محصولات سبد خرید نامعتبر است.');
      err.status = 400;
      throw err;
    }
    const { rows: products } = await tx.query(
      `SELECT id, name, price, stock, images, is_active FROM products WHERE id = ANY($1::int[])`,
      [ids]
    );
    if (!products.length) {
      const err = new Error('محصولات سبد خرید یافت نشد.');
      err.status = 400;
      throw err;
    }

    let subtotal = 0;
    const prepared = [];
    for (const item of items) {
      const product = products.find((p) => p.id === toInt(item.product_id));
      if (!product || !product.is_active) continue;
      const qty = Math.min(Math.max(toInt(item.qty, 1), 1), 20);
      if (product.stock < qty) {
        const err = new Error(`موجودی «${product.name}» کافی نیست.`);
        err.status = 400;
        throw err;
      }
      subtotal += Number(product.price) * qty;
      prepared.push({
        product,
        qty,
        name: product.name,
        price: Number(product.price),
        image: Array.isArray(product.images) ? product.images[0] || '' : '',
      });
    }
    if (!prepared.length) {
      const err = new Error('هیچ محصول معتبری در سبد نیست.');
      err.status = 400;
      throw err;
    }

    let discount = 0;
    let couponCode = '';
    if (body.coupon_code) {
      const { rows: cp } = await tx.query(
        'SELECT * FROM coupons WHERE upper(code) = upper($1) AND is_active = true',
        [String(body.coupon_code).trim()]
      );
      const coupon = cp[0];
      if (coupon && (!coupon.expires_at || new Date(coupon.expires_at) >= new Date())) {
        if (coupon.max_uses === 0 || coupon.used < coupon.max_uses) {
          if (subtotal >= coupon.min_total) {
            discount = coupon.percent > 0 ? Math.floor((subtotal * coupon.percent) / 100) : coupon.amount;
            couponCode = coupon.code;
            await tx.query('UPDATE coupons SET used = used + 1 WHERE id = $1', [coupon.id]);
          }
        }
      }
    }

    const shipping = freeOver > 0 && subtotal >= freeOver ? 0 : shippingBase;
    const total = Math.max(subtotal + shipping - discount, 0);
    const code = `SENZ-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 9)}`;

    const { rows: inserted } = await tx.query(
      `INSERT INTO orders
        (code, customer_name, phone, email, province, city, address, postal_code, note,
         subtotal, discount, shipping, total, coupon_code, payment_method, status, customer_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'pending',$16)
       RETURNING *`,
      [
        code,
        String(body.customer_name).slice(0, 120),
        String(body.phone).replace(/[^\d]/g, ''),
        String(body.email || '').slice(0, 120),
        String(body.province || '').slice(0, 80),
        String(body.city || '').slice(0, 80),
        String(body.address).slice(0, 500),
        String(body.postal_code || '').slice(0, 20),
        String(body.note || '').slice(0, 500),
        subtotal,
        discount,
        shipping,
        total,
        couponCode,
        requestedPayment,
        req.customer?.sub || null,
      ]
    );
    const order = inserted[0];

    for (const item of prepared) {
      await tx.query(
        `INSERT INTO order_items (order_id, product_id, name, image, price, qty)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [order.id, item.product.id, item.name, item.image, item.price, item.qty]
      );
      await tx.query(
        'UPDATE products SET stock = GREATEST(stock - $1, 0), sold = sold + $1 WHERE id = $2',
        [item.qty, item.product.id]
      );
    }

    const { rows: orderItems } = await tx.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [order.id]
    );
    return { order, items: orderItems };
  });

  let payment = null;
  if (result.order.payment_method === 'online' && result.order.payment_status !== 'paid') {
    payment = await createPaymentForOrder(result.order);
  }

  res.status(201).json({
    ok: true,
    code: result.order.code,
    order: result.order,
    items: result.items,
    payment,
    message: 'سفارش شما با موفقیت ثبت شد.',
  });
}));

router.get('/orders/track/:code', wrap(async (req, res) => {
  const { rows } = await query('SELECT * FROM orders WHERE code = $1', [req.params.code.trim()]);
  if (!rows.length) return res.status(404).json({ error: 'سفارشی با این کد پیدا نشد.' });
  const order = rows[0];
  const items = await query('SELECT name, image, price, qty FROM order_items WHERE order_id = $1', [order.id]);
  const payments = await query(
    'SELECT gateway, amount, status, ref_id, paid_at FROM payments WHERE order_id = $1 ORDER BY id DESC',
    [order.id]
  );
  res.json({ ...order, items: items.rows, payments: payments.rows });
}));

router.post('/newsletter', wrap(async (req, res) => {
  const { email } = req.body || {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: 'ایمیل معتبر نیست.' });
  await query('INSERT INTO subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING', [email]);
  res.json({ ok: true, message: 'عضویت شما در خبرنامه ثبت شد.' });
}));

/* ------------------------------ auth ------------------------------ */
router.post('/auth/login', wrap(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'ایمیل و رمز عبور الزامی است.' });
  const { rows } = await query('SELECT * FROM admins WHERE lower(email) = lower($1)', [String(email).trim()]);
  const admin = rows[0];
  if (!admin || !bcrypt.compareSync(String(password), admin.password_hash))
    return res.status(401).json({ error: 'ایمیل یا رمز عبور اشتباه است.' });
  res.json({
    token: signToken(admin),
    admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
  });
}));

router.get('/auth/me', requireAdmin, wrap(async (req, res) => {
  const { rows } = await query('SELECT id, name, email, role FROM admins WHERE id = $1', [req.admin.sub]);
  if (!rows.length) return res.status(401).json({ error: 'حساب کاربری یافت نشد.' });
  res.json(rows[0]);
}));

router.post('/auth/password', requireAdmin, wrap(async (req, res) => {
  const { current_password, new_password } = req.body || {};
  if (!new_password || String(new_password).length < 8)
    return res.status(400).json({ error: 'رمز جدید باید حداقل ۸ کاراکتر باشد.' });
  const { rows } = await query('SELECT * FROM admins WHERE id = $1', [req.admin.sub]);
  const admin = rows[0];
  if (!admin || !bcrypt.compareSync(String(current_password || ''), admin.password_hash))
    return res.status(400).json({ error: 'رمز فعلی اشتباه است.' });
  const hash = bcrypt.hashSync(String(new_password), 10);
  await query('UPDATE admins SET password_hash = $1 WHERE id = $2', [hash, admin.id]);
  res.json({ ok: true, message: 'رمز عبور تغییر کرد.' });
}));

export { shapeProduct, PRODUCT_COLUMNS, getCategoryTree };
export default router;
