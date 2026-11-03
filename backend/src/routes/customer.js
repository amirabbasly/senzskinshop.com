import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';
import { requireCustomer, signCustomerToken } from '../auth.js';
import { toInt, wrap } from '../helpers.js';

const router = Router();

const normalizePhone = (phone = '') =>
  String(phone)
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[^\d]/g, '');

function publicCustomer(row) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    created_at: row.created_at,
  };
}

router.post('/register', wrap(async (req, res) => {
  const { name, phone, password, email } = req.body || {};
  const cleanPhone = normalizePhone(phone);
  const cleanName = String(name || '').trim();

  if (cleanName.length < 3) return res.status(400).json({ error: 'نام و نام خانوادگی را کامل وارد کنید.' });
  if (!/^09\d{9}$/.test(cleanPhone))
    return res.status(400).json({ error: 'شماره موبایل معتبر نیست (مثال: ۰۹۱۲۱۲۳۴۵۶۷).' });
  if (!password || String(password).length < 6)
    return res.status(400).json({ error: 'رمز عبور باید حداقل ۶ کاراکتر باشد.' });

  const { rows: existing } = await query('SELECT id FROM customers WHERE phone = $1', [cleanPhone]);
  if (existing.length)
    return res.status(409).json({ error: 'این شماره قبلاً ثبت‌نام کرده است. وارد شوید.' });

  const hash = bcrypt.hashSync(String(password), 10);
  const { rows } = await query(
    `INSERT INTO customers (name, phone, email, password_hash)
     VALUES ($1, $2, $3, $4) RETURNING id, name, phone, email, created_at`,
    [cleanName.slice(0, 120), cleanPhone, String(email || '').slice(0, 120), hash]
  );

  const customer = rows[0];
  res.status(201).json({
    token: signCustomerToken(customer),
    customer: publicCustomer(customer),
    message: 'حساب کاربری شما ساخته شد.',
  });
}));

router.post('/login', wrap(async (req, res) => {
  const { phone, password } = req.body || {};
  const cleanPhone = normalizePhone(phone);
  if (!cleanPhone || !password) return res.status(400).json({ error: 'شماره موبایل و رمز عبور را وارد کنید.' });

  const { rows } = await query('SELECT * FROM customers WHERE phone = $1', [cleanPhone]);
  const customer = rows[0];
  if (!customer || !bcrypt.compareSync(String(password), customer.password_hash))
    return res.status(401).json({ error: 'شماره موبایل یا رمز عبور اشتباه است.' });

  res.json({
    token: signCustomerToken(customer),
    customer: publicCustomer(customer),
    message: 'خوش آمدید!',
  });
}));

router.get('/me', requireCustomer, wrap(async (req, res) => {
  const { rows } = await query(
    'SELECT id, name, phone, email, created_at FROM customers WHERE id = $1',
    [req.customer.sub]
  );
  if (!rows.length) return res.status(401).json({ error: 'حساب کاربری یافت نشد.' });
  res.json(rows[0]);
}));

router.put('/profile', requireCustomer, wrap(async (req, res) => {
  const { name, email } = req.body || {};
  if (!name || String(name).trim().length < 3)
    return res.status(400).json({ error: 'نام و نام خانوادگی را کامل وارد کنید.' });
  const { rows } = await query(
    `UPDATE customers SET name = $1, email = $2 WHERE id = $3
     RETURNING id, name, phone, email, created_at`,
    [String(name).trim().slice(0, 120), String(email || '').slice(0, 120), req.customer.sub]
  );
  res.json({ ok: true, customer: rows[0], message: 'اطلاعات حساب به‌روزرسانی شد.' });
}));

router.post('/password', requireCustomer, wrap(async (req, res) => {
  const { current_password, new_password } = req.body || {};
  if (!new_password || String(new_password).length < 6)
    return res.status(400).json({ error: 'رمز جدید باید حداقل ۶ کاراکتر باشد.' });
  const { rows } = await query('SELECT * FROM customers WHERE id = $1', [req.customer.sub]);
  const customer = rows[0];
  if (!customer || !bcrypt.compareSync(String(current_password || ''), customer.password_hash))
    return res.status(400).json({ error: 'رمز فعلی اشتباه است.' });
  await query('UPDATE customers SET password_hash = $1 WHERE id = $2', [
    bcrypt.hashSync(String(new_password), 10),
    customer.id,
  ]);
  res.json({ ok: true, message: 'رمز عبور تغییر کرد.' });
}));

router.get('/orders', requireCustomer, wrap(async (req, res) => {
  const { rows } = await query(
    `SELECT o.*, (SELECT COALESCE(SUM(qty),0)::int FROM order_items i WHERE i.order_id = o.id) AS items_count
     FROM orders o
     WHERE o.customer_id = $1 OR (o.customer_id IS NULL AND o.phone = $2)
     ORDER BY o.created_at DESC LIMIT 100`,
    [req.customer.sub, req.customer.phone]
  );
  res.json({ orders: rows });
}));

router.get('/orders/:code', requireCustomer, wrap(async (req, res) => {
  const { rows } = await query('SELECT * FROM orders WHERE code = $1', [req.params.code]);
  const order = rows[0];
  if (!order) return res.status(404).json({ error: 'سفارش یافت نشد.' });
  if (order.customer_id !== req.customer.sub && order.phone !== req.customer.phone)
    return res.status(403).json({ error: 'دسترسی به این سفارش مجاز نیست.' });

  const items = await query(
    `SELECT i.product_id, i.name, i.image, i.price, i.qty,
            p.slug, p.stock, p.is_active, p.price AS current_price
       FROM order_items i
       LEFT JOIN products p ON p.id = i.product_id
      WHERE i.order_id = $1`,
    [order.id]
  );
  const payments = await query(
    'SELECT gateway, amount, status, ref_id, paid_at FROM payments WHERE order_id = $1 ORDER BY id DESC',
    [order.id]
  );
  res.json({ ...order, items: items.rows, payments: payments.rows });
}));

// ---------------- address book ----------------

function cleanAddress(body = {}) {
  return {
    title: String(body.title || 'آدرس من').trim().slice(0, 60) || 'آدرس من',
    recipient: String(body.recipient || '').trim().slice(0, 120),
    phone: normalizePhone(body.phone || ''),
    province: String(body.province || '').trim().slice(0, 60),
    city: String(body.city || '').trim().slice(0, 60),
    address: String(body.address || '').trim().slice(0, 500),
    postal_code: normalizePhone(body.postal_code || '').slice(0, 10),
    is_default: Boolean(body.is_default),
  };
}

function validateAddress(a) {
  if (!a.province) return 'استان را انتخاب کنید.';
  if (!a.city) return 'شهر را وارد کنید.';
  if (a.address.length < 10) return 'آدرس کامل پستی را وارد کنید.';
  return '';
}

router.get('/addresses', requireCustomer, wrap(async (req, res) => {
  const { rows } = await query(
    'SELECT * FROM customer_addresses WHERE customer_id = $1 ORDER BY is_default DESC, id DESC',
    [req.customer.sub]
  );
  res.json({ addresses: rows });
}));

router.post('/addresses', requireCustomer, wrap(async (req, res) => {
  const data = cleanAddress(req.body);
  const invalid = validateAddress(data);
  if (invalid) return res.status(400).json({ error: invalid });

  const { rows: existing } = await query(
    'SELECT COUNT(*)::int AS c FROM customer_addresses WHERE customer_id = $1',
    [req.customer.sub]
  );
  const isDefault = data.is_default || existing[0].c === 0;

  if (isDefault) {
    await query('UPDATE customer_addresses SET is_default = false WHERE customer_id = $1', [
      req.customer.sub,
    ]);
  }

  const { rows } = await query(
    `INSERT INTO customer_addresses
       (customer_id, title, recipient, phone, province, city, address, postal_code, is_default)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [
      req.customer.sub,
      data.title,
      data.recipient,
      data.phone,
      data.province,
      data.city,
      data.address,
      data.postal_code,
      isDefault,
    ]
  );
  res.status(201).json({ address: rows[0], message: 'آدرس ذخیره شد.' });
}));

router.put('/addresses/:id', requireCustomer, wrap(async (req, res) => {
  const id = toInt(req.params.id);
  const data = cleanAddress(req.body);
  const invalid = validateAddress(data);
  if (invalid) return res.status(400).json({ error: invalid });

  const { rows: owned } = await query(
    'SELECT id FROM customer_addresses WHERE id = $1 AND customer_id = $2',
    [id, req.customer.sub]
  );
  if (!owned.length) return res.status(404).json({ error: 'آدرس یافت نشد.' });

  if (data.is_default) {
    await query('UPDATE customer_addresses SET is_default = false WHERE customer_id = $1', [
      req.customer.sub,
    ]);
  }

  const { rows } = await query(
    `UPDATE customer_addresses
        SET title=$1, recipient=$2, phone=$3, province=$4, city=$5, address=$6,
            postal_code=$7, is_default = CASE WHEN $8 THEN true ELSE is_default END
      WHERE id=$9 AND customer_id=$10
      RETURNING *`,
    [
      data.title,
      data.recipient,
      data.phone,
      data.province,
      data.city,
      data.address,
      data.postal_code,
      data.is_default,
      id,
      req.customer.sub,
    ]
  );
  res.json({ address: rows[0], message: 'آدرس به‌روزرسانی شد.' });
}));

router.delete('/addresses/:id', requireCustomer, wrap(async (req, res) => {
  const id = toInt(req.params.id);
  const { rows } = await query(
    'DELETE FROM customer_addresses WHERE id = $1 AND customer_id = $2 RETURNING id, is_default',
    [id, req.customer.sub]
  );
  if (!rows.length) return res.status(404).json({ error: 'آدرس یافت نشد.' });

  if (rows[0].is_default) {
    await query(
      `UPDATE customer_addresses SET is_default = true
        WHERE id = (SELECT id FROM customer_addresses WHERE customer_id = $1 ORDER BY id DESC LIMIT 1)`,
      [req.customer.sub]
    );
  }
  res.json({ ok: true, message: 'آدرس حذف شد.' });
}));

export { normalizePhone };
export default router;
