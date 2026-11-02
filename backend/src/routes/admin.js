import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { Router } from 'express';
import multer from 'multer';
import { query } from '../db.js';
import { jsonArray, parseMoney, slugify, toBool, toInt, wrap } from '../helpers.js';
import { PRODUCT_COLUMNS, shapeProduct } from './public.js';

const router = Router();
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
  'image/avif': '.avif',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = ALLOWED[file.mimetype] || path.extname(file.originalname) || '.jpg';
    cb(null, `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED[file.mimetype]) return cb(new Error('فقط فایل تصویری مجاز است.'));
    cb(null, true);
  },
});

router.post('/upload', (req, res) => {
  upload.array('files', 8)(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message || 'خطا در بارگذاری فایل.' });
    const files = (req.files || []).map((f) => `/uploads/${f.filename}`);
    if (!files.length) return res.status(400).json({ error: 'فایلی انتخاب نشده است.' });
    res.json({ ok: true, files, url: files[0] });
  });
});

/* ------------------------------ dashboard ------------------------------ */
router.get('/dashboard', wrap(async (req, res) => {
  const [orders, revenue, products, customers, pending, recent, lowStock, top, days, reviews] =
    await Promise.all([
      query('SELECT COUNT(*)::int AS c FROM orders'),
      query("SELECT COALESCE(SUM(total),0)::bigint AS s FROM orders WHERE status <> 'cancelled'"),
      query('SELECT COUNT(*)::int AS c FROM products WHERE is_active'),
      query('SELECT COUNT(DISTINCT phone)::int AS c FROM orders'),
      query("SELECT COUNT(*)::int AS c FROM orders WHERE status = 'pending'"),
      query(`SELECT * FROM orders ORDER BY created_at DESC LIMIT 6`),
      query('SELECT id, name, stock, images FROM products WHERE stock <= 5 AND is_active ORDER BY stock ASC LIMIT 6'),
      query('SELECT id, name, slug, sold, price, images FROM products ORDER BY sold DESC LIMIT 5'),
      query(`SELECT to_char(created_at, 'YYYY-MM-DD') AS day, SUM(total)::bigint AS revenue, COUNT(*)::int AS orders
             FROM orders WHERE created_at > now() - interval '14 days'
             GROUP BY 1 ORDER BY 1`),
      query('SELECT COUNT(*)::int AS c FROM reviews WHERE is_approved = false'),
    ]);

  res.json({
    stats: {
      orders: orders.rows[0].c,
      revenue: Number(revenue.rows[0].s),
      products: products.rows[0].c,
      customers: customers.rows[0].c,
      pending: pending.rows[0].c,
      pending_reviews: reviews.rows[0].c,
    },
    recent_orders: recent.rows,
    low_stock: lowStock.rows.map((p) => ({ ...p, images: jsonArray(p.images) })),
    top_products: top.rows.map((p) => ({ ...p, images: jsonArray(p.images) })),
    sales_by_day: days.rows.map((d) => ({ ...d, revenue: Number(d.revenue) })),
  });
}));

/* ------------------------------ products ------------------------------ */
function normalizeProduct(body) {
  const images = Array.isArray(body.images)
    ? body.images.filter(Boolean).map(String)
    : String(body.images || '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
  const specs = Array.isArray(body.specs)
    ? body.specs
        .filter((s) => s && (s.key || s.value))
        .map((s) => ({ key: String(s.key || '').trim(), value: String(s.value || '').trim() }))
    : [];

  return {
    name: String(body.name || '').trim(),
    slug: slugify(body.slug || body.name),
    brand: String(body.brand || 'سنز اسکین').trim(),
    category_id: body.category_id ? toInt(body.category_id) : null,
    short_desc: String(body.short_desc || ''),
    description: String(body.description || ''),
    ingredients: String(body.ingredients || ''),
    how_to_use: String(body.how_to_use || ''),
    price: parseMoney(body.price),
    compare_price: parseMoney(body.compare_price),
    stock: toInt(body.stock, 0),
    sku: String(body.sku || ''),
    volume: String(body.volume || ''),
    skin_type: String(body.skin_type || ''),
    images: JSON.stringify(images),
    specs: JSON.stringify(specs),
    is_active: toBool(body.is_active, true),
    is_featured: toBool(body.is_featured, false),
    is_bestseller: toBool(body.is_bestseller, false),
  };
}

async function ensureSlug(slug, id = null) {
  let candidate = slug;
  for (let i = 0; i < 25; i += 1) {
    const { rows } = await query(
      'SELECT id FROM products WHERE slug = $1 AND ($2::int IS NULL OR id <> $2::int)',
      [candidate, id]
    );
    if (!rows.length) return candidate;
    candidate = `${slug}-${i + 2}`;
  }
  return `${slug}-${Date.now().toString(36)}`;
}

router.get('/products', wrap(async (req, res) => {
  const { q, category, status, page = 1, limit = 20 } = req.query;
  const where = ['1=1'];
  const params = [];
  if (q) {
    params.push(`%${q}%`);
    where.push(`(p.name ILIKE $${params.length} OR p.sku ILIKE $${params.length} OR p.brand ILIKE $${params.length})`);
  }
  if (category) {
    params.push(toInt(category));
    where.push(`p.category_id = $${params.length}`);
  }
  if (status === 'active') where.push('p.is_active = true');
  if (status === 'inactive') where.push('p.is_active = false');

  const perPage = Math.min(Math.max(toInt(limit, 20), 1), 100);
  const current = Math.max(toInt(page, 1), 1);
  const offset = (current - 1) * perPage;

  const [{ rows: count }, { rows }] = await Promise.all([
    query(`SELECT COUNT(*)::int AS c FROM products p WHERE ${where.join(' AND ')}`, params),
    query(
      `SELECT ${PRODUCT_COLUMNS}, c.name AS category_name FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE ${where.join(' AND ')} ORDER BY p.created_at DESC, p.id DESC
       LIMIT ${perPage} OFFSET ${offset}`,
      params
    ),
  ]);

  res.json({
    items: rows.map(shapeProduct),
    total: count[0].c,
    page: current,
    pages: Math.max(Math.ceil(count[0].c / perPage), 1),
  });
}));

router.get('/products/:id', wrap(async (req, res) => {
  const { rows } = await query(
    `SELECT ${PRODUCT_COLUMNS}, c.name AS category_name FROM products p
     LEFT JOIN categories c ON c.id = p.category_id WHERE p.id = $1`,
    [toInt(req.params.id)]
  );
  if (!rows.length) return res.status(404).json({ error: 'محصول یافت نشد.' });
  res.json(shapeProduct(rows[0]));
}));

router.post('/products', wrap(async (req, res) => {
  const data = normalizeProduct(req.body || {});
  if (!data.name) return res.status(400).json({ error: 'نام محصول الزامی است.' });
  data.slug = await ensureSlug(data.slug);
  const { rows } = await query(
    `INSERT INTO products
      (name, slug, brand, category_id, short_desc, description, ingredients, how_to_use,
       price, compare_price, stock, sku, volume, skin_type, images, specs,
       is_active, is_featured, is_bestseller)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15::jsonb,$16::jsonb,$17,$18,$19)
     RETURNING *`,
    [
      data.name, data.slug, data.brand, data.category_id, data.short_desc, data.description,
      data.ingredients, data.how_to_use, data.price, data.compare_price, data.stock, data.sku,
      data.volume, data.skin_type, data.images, data.specs, data.is_active, data.is_featured,
      data.is_bestseller,
    ]
  );
  res.status(201).json(shapeProduct(rows[0]));
}));

router.put('/products/:id', wrap(async (req, res) => {
  const id = toInt(req.params.id);
  const data = normalizeProduct(req.body || {});
  if (!data.name) return res.status(400).json({ error: 'نام محصول الزامی است.' });
  data.slug = await ensureSlug(data.slug, id);
  const { rows } = await query(
    `UPDATE products SET
      name=$1, slug=$2, brand=$3, category_id=$4, short_desc=$5, description=$6,
      ingredients=$7, how_to_use=$8, price=$9, compare_price=$10, stock=$11, sku=$12,
      volume=$13, skin_type=$14, images=$15::jsonb, specs=$16::jsonb, is_active=$17,
      is_featured=$18, is_bestseller=$19, updated_at=now()
     WHERE id=$20 RETURNING *`,
    [
      data.name, data.slug, data.brand, data.category_id, data.short_desc, data.description,
      data.ingredients, data.how_to_use, data.price, data.compare_price, data.stock, data.sku,
      data.volume, data.skin_type, data.images, data.specs, data.is_active, data.is_featured,
      data.is_bestseller, id,
    ]
  );
  if (!rows.length) return res.status(404).json({ error: 'محصول یافت نشد.' });
  res.json(shapeProduct(rows[0]));
}));

router.delete('/products/:id', wrap(async (req, res) => {
  await query('DELETE FROM products WHERE id = $1', [toInt(req.params.id)]);
  res.json({ ok: true });
}));

/* ------------------------------ categories ------------------------------ */
router.get('/categories', wrap(async (req, res) => {
  const { rows } = await query(
    `SELECT c.*, (SELECT COUNT(*)::int FROM products p WHERE p.category_id = c.id) AS product_count,
            pc.name AS parent_name
     FROM categories c LEFT JOIN categories pc ON pc.id = c.parent_id
     ORDER BY COALESCE(c.parent_id, c.id), c.parent_id NULLS FIRST, c.sort_order, c.id`
  );
  res.json(rows);
}));

router.post('/categories', wrap(async (req, res) => {
  const b = req.body || {};
  if (!b.name) return res.status(400).json({ error: 'نام دسته‌بندی الزامی است.' });
  const { rows: exists } = await query('SELECT id FROM categories WHERE slug = $1', [slugify(b.slug || b.name)]);
  const slug = exists.length ? `${slugify(b.slug || b.name)}-${Math.random().toString(36).slice(2, 5)}` : slugify(b.slug || b.name);
  const { rows } = await query(
    `INSERT INTO categories (parent_id, name, slug, description, image, icon, sort_order, is_active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [
      b.parent_id ? toInt(b.parent_id) : null,
      String(b.name).trim(),
      slug,
      String(b.description || ''),
      String(b.image || ''),
      String(b.icon || ''),
      toInt(b.sort_order, 0),
      toBool(b.is_active, true),
    ]
  );
  res.status(201).json(rows[0]);
}));

router.put('/categories/:id', wrap(async (req, res) => {
  const id = toInt(req.params.id);
  const b = req.body || {};
  if (!b.name) return res.status(400).json({ error: 'نام دسته‌بندی الزامی است.' });
  const parentId = b.parent_id ? toInt(b.parent_id) : null;
  if (parentId === id) return res.status(400).json({ error: 'دسته‌بندی نمی‌تواند والد خودش باشد.' });
  const { rows: exists } = await query(
    'SELECT id FROM categories WHERE slug = $1 AND id <> $2',
    [slugify(b.slug || b.name), id]
  );
  const slug = exists.length ? `${slugify(b.slug || b.name)}-${Math.random().toString(36).slice(2, 5)}` : slugify(b.slug || b.name);
  const { rows } = await query(
    `UPDATE categories SET parent_id=$1, name=$2, slug=$3, description=$4, image=$5, icon=$6,
      sort_order=$7, is_active=$8 WHERE id=$9 RETURNING *`,
    [parentId, String(b.name).trim(), slug, String(b.description || ''), String(b.image || ''),
      String(b.icon || ''), toInt(b.sort_order, 0), toBool(b.is_active, true), id]
  );
  if (!rows.length) return res.status(404).json({ error: 'دسته‌بندی یافت نشد.' });
  res.json(rows[0]);
}));

router.delete('/categories/:id', wrap(async (req, res) => {
  await query('DELETE FROM categories WHERE id = $1', [toInt(req.params.id)]);
  res.json({ ok: true });
}));

/* ------------------------------ banners ------------------------------ */
router.get('/banners', wrap(async (req, res) => {
  const { rows } = await query('SELECT * FROM banners ORDER BY placement, sort_order, id');
  res.json(rows);
}));

router.post('/banners', wrap(async (req, res) => {
  const b = req.body || {};
  const { rows } = await query(
    `INSERT INTO banners (title, subtitle, badge, image, link, btn_text, placement, sort_order, is_active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [b.title || '', b.subtitle || '', b.badge || '', b.image || '', b.link || '/products',
      b.btn_text || 'مشاهده', b.placement || 'hero', toInt(b.sort_order, 0), toBool(b.is_active, true)]
  );
  res.status(201).json(rows[0]);
}));

router.put('/banners/:id', wrap(async (req, res) => {
  const b = req.body || {};
  const { rows } = await query(
    `UPDATE banners SET title=$1, subtitle=$2, badge=$3, image=$4, link=$5, btn_text=$6,
      placement=$7, sort_order=$8, is_active=$9 WHERE id=$10 RETURNING *`,
    [b.title || '', b.subtitle || '', b.badge || '', b.image || '', b.link || '/products',
      b.btn_text || 'مشاهده', b.placement || 'hero', toInt(b.sort_order, 0), toBool(b.is_active, true),
      toInt(req.params.id)]
  );
  if (!rows.length) return res.status(404).json({ error: 'بنر یافت نشد.' });
  res.json(rows[0]);
}));

router.delete('/banners/:id', wrap(async (req, res) => {
  await query('DELETE FROM banners WHERE id = $1', [toInt(req.params.id)]);
  res.json({ ok: true });
}));

/* ------------------------------ posts ------------------------------ */
router.get('/posts', wrap(async (req, res) => {
  const { rows } = await query('SELECT * FROM posts ORDER BY created_at DESC');
  res.json(rows);
}));

router.post('/posts', wrap(async (req, res) => {
  const b = req.body || {};
  if (!b.title) return res.status(400).json({ error: 'عنوان مقاله الزامی است.' });
  const { rows: exists } = await query('SELECT id FROM posts WHERE slug = $1', [slugify(b.slug || b.title)]);
  const slug = exists.length ? `${slugify(b.slug || b.title)}-${Math.random().toString(36).slice(2, 5)}` : slugify(b.slug || b.title);
  const { rows } = await query(
    `INSERT INTO posts (title, slug, excerpt, content, cover, author, is_published)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [b.title, slug, b.excerpt || '', b.content || '', b.cover || '', b.author || 'تیم سنز', toBool(b.is_published, true)]
  );
  res.status(201).json(rows[0]);
}));

router.put('/posts/:id', wrap(async (req, res) => {
  const b = req.body || {};
  const id = toInt(req.params.id);
  const { rows: exists } = await query('SELECT id FROM posts WHERE slug = $1 AND id <> $2', [slugify(b.slug || b.title), id]);
  const slug = exists.length ? `${slugify(b.slug || b.title)}-${Math.random().toString(36).slice(2, 5)}` : slugify(b.slug || b.title);
  const { rows } = await query(
    `UPDATE posts SET title=$1, slug=$2, excerpt=$3, content=$4, cover=$5, author=$6, is_published=$7
     WHERE id=$8 RETURNING *`,
    [b.title, slug, b.excerpt || '', b.content || '', b.cover || '', b.author || 'تیم سنز',
      toBool(b.is_published, true), id]
  );
  if (!rows.length) return res.status(404).json({ error: 'مقاله یافت نشد.' });
  res.json(rows[0]);
}));

router.delete('/posts/:id', wrap(async (req, res) => {
  await query('DELETE FROM posts WHERE id = $1', [toInt(req.params.id)]);
  res.json({ ok: true });
}));

/* ------------------------------ coupons ------------------------------ */
router.get('/coupons', wrap(async (req, res) => {
  const { rows } = await query('SELECT * FROM coupons ORDER BY created_at DESC');
  res.json(rows);
}));

router.post('/coupons', wrap(async (req, res) => {
  const b = req.body || {};
  if (!b.code) return res.status(400).json({ error: 'کد تخفیف الزامی است.' });
  const { rows } = await query(
    `INSERT INTO coupons (code, percent, amount, min_total, max_uses, is_active, expires_at)
     VALUES (upper($1), $2, $3, $4, $5, $6, $7) RETURNING *`,
    [String(b.code).trim(), toInt(b.percent, 0), toInt(b.amount, 0), toInt(b.min_total, 0),
      toInt(b.max_uses, 0), toBool(b.is_active, true), b.expires_at || null]
  );
  res.status(201).json(rows[0]);
}));

router.put('/coupons/:id', wrap(async (req, res) => {
  const b = req.body || {};
  const { rows } = await query(
    `UPDATE coupons SET code=upper($1), percent=$2, amount=$3, min_total=$4, max_uses=$5,
      is_active=$6, expires_at=$7 WHERE id=$8 RETURNING *`,
    [String(b.code).trim(), toInt(b.percent, 0), toInt(b.amount, 0), toInt(b.min_total, 0),
      toInt(b.max_uses, 0), toBool(b.is_active, true), b.expires_at || null, toInt(req.params.id)]
  );
  if (!rows.length) return res.status(404).json({ error: 'کد تخفیف یافت نشد.' });
  res.json(rows[0]);
}));

router.delete('/coupons/:id', wrap(async (req, res) => {
  await query('DELETE FROM coupons WHERE id = $1', [toInt(req.params.id)]);
  res.json({ ok: true });
}));

/* ------------------------------ orders ------------------------------ */
router.get('/orders', wrap(async (req, res) => {
  const { status, q, page = 1, limit = 20 } = req.query;
  const where = ['1=1'];
  const params = [];
  if (status && status !== 'all') {
    params.push(status);
    where.push(`o.status = $${params.length}`);
  }
  if (q) {
    params.push(`%${q}%`);
    where.push(`(o.code ILIKE $${params.length} OR o.customer_name ILIKE $${params.length} OR o.phone ILIKE $${params.length})`);
  }
  const perPage = Math.min(Math.max(toInt(limit, 20), 1), 100);
  const current = Math.max(toInt(page, 1), 1);
  const offset = (current - 1) * perPage;
  const [{ rows: count }, { rows }] = await Promise.all([
    query(`SELECT COUNT(*)::int AS c FROM orders o WHERE ${where.join(' AND ')}`, params),
    query(
      `SELECT o.*, (SELECT COALESCE(SUM(qty),0)::int FROM order_items i WHERE i.order_id = o.id) AS items_count
       FROM orders o WHERE ${where.join(' AND ')}
       ORDER BY o.created_at DESC LIMIT ${perPage} OFFSET ${offset}`,
      params
    ),
  ]);
  res.json({ items: rows, total: count[0].c, page: current, pages: Math.max(Math.ceil(count[0].c / perPage), 1) });
}));

router.get('/orders/:id', wrap(async (req, res) => {
  const id = toInt(req.params.id);
  const { rows } = await query('SELECT * FROM orders WHERE id = $1', [id]);
  if (!rows.length) return res.status(404).json({ error: 'سفارش یافت نشد.' });
  const items = await query('SELECT * FROM order_items WHERE order_id = $1', [id]);
  const paymentsRows = await query(
    `SELECT id, gateway, amount, status, ref_id, authority, created_at, paid_at
     FROM payments WHERE order_id = $1 ORDER BY id DESC`,
    [id]
  );
  res.json({ ...rows[0], items: items.rows, payments: paymentsRows.rows });
}));

router.patch('/orders/:id', wrap(async (req, res) => {
  const { status, note, payment_status } = req.body || {};
  const allowed = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled', 'returned'];
  const allowedPayments = ['unpaid', 'paid', 'failed', 'refunded'];
  const id = toInt(req.params.id);
  if (status && !allowed.includes(status)) return res.status(400).json({ error: 'وضعیت نامعتبر است.' });
  if (payment_status && !allowedPayments.includes(payment_status))
    return res.status(400).json({ error: 'وضعیت پرداخت نامعتبر است.' });
  const { rows } = await query(
    `UPDATE orders SET status = COALESCE($1, status), note = COALESCE($2, note),
       payment_status = COALESCE($3, payment_status), updated_at = now()
     WHERE id = $4 RETURNING *`,
    [status || null, note === undefined ? null : String(note), payment_status || null, id]
  );
  if (!rows.length) return res.status(404).json({ error: 'سفارش یافت نشد.' });
  res.json(rows[0]);
}));

router.delete('/orders/:id', wrap(async (req, res) => {
  await query('DELETE FROM orders WHERE id = $1', [toInt(req.params.id)]);
  res.json({ ok: true });
}));

/* ------------------------------ reviews ------------------------------ */
router.get('/reviews', wrap(async (req, res) => {
  const status = req.query.status;
  const where = status === 'pending' ? 'r.is_approved = false' : status === 'approved' ? 'r.is_approved = true' : '1=1';
  const { rows } = await query(
    `SELECT r.*, p.name AS product_name, p.slug AS product_slug FROM reviews r
     JOIN products p ON p.id = r.product_id WHERE ${where} ORDER BY r.created_at DESC`
  );
  res.json(rows);
}));

router.patch('/reviews/:id', wrap(async (req, res) => {
  const { is_approved } = req.body || {};
  const { rows } = await query(
    'UPDATE reviews SET is_approved = $1 WHERE id = $2 RETURNING *',
    [toBool(is_approved, false), toInt(req.params.id)]
  );
  if (!rows.length) return res.status(404).json({ error: 'نظر یافت نشد.' });
  res.json(rows[0]);
}));

router.delete('/reviews/:id', wrap(async (req, res) => {
  await query('DELETE FROM reviews WHERE id = $1', [toInt(req.params.id)]);
  res.json({ ok: true });
}));

/* ------------------------------ settings ------------------------------ */
router.get('/settings', wrap(async (req, res) => {
  const { rows } = await query('SELECT key, value FROM settings');
  res.json(Object.fromEntries(rows.map((r) => [r.key, r.value])));
}));

router.put('/settings', wrap(async (req, res) => {
  const body = req.body || {};
  const entries = Object.entries(body);
  if (!entries.length) return res.status(400).json({ error: 'داده‌ای ارسال نشده است.' });
  for (const [key, value] of entries) {
    await query(
      `INSERT INTO settings (key, value) VALUES ($1, $2::jsonb)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
      [key, JSON.stringify(value)]
    );
  }
  const { rows } = await query('SELECT key, value FROM settings');
  res.json({ ok: true, settings: Object.fromEntries(rows.map((r) => [r.key, r.value])) });
}));

router.get('/subscribers', wrap(async (req, res) => {
  const { rows } = await query('SELECT * FROM subscribers ORDER BY created_at DESC');
  res.json(rows);
}));

export default router;
