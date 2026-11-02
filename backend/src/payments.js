import crypto from 'node:crypto';
import { query } from './db.js';

/**
 * Payment layer.
 *
 * The storefront currently ships with the `mock` gateway so the whole flow
 * (order → payment → confirmation) can be tested without a real PSP account.
 * To plug a real gateway (Zarinpal / IDPay / Zibal) implement `create()` and
 * `verify()` below and set PAYMENT_GATEWAY=zarinpal in .env.
 */
export const activeGateway = () => process.env.PAYMENT_GATEWAY || 'mock';

export const GATEWAY_LABELS = {
  mock: 'درگاه پرداخت آزمایشی (نمونه)',
  zarinpal: 'زرین‌پال',
  idpay: 'آیدی‌پی',
  zibal: 'زیبال',
};

function randomAuthority(gateway) {
  return `${gateway.toUpperCase()}-${crypto.randomBytes(10).toString('hex').toUpperCase()}`;
}

export function mockRefId() {
  return String(Math.floor(100_000_000 + Math.random() * 900_000_000));
}

export async function createPaymentForOrder(order) {
  const gateway = activeGateway();
  const authority = randomAuthority(gateway);

  const { rows } = await query(
    `INSERT INTO payments (order_id, gateway, amount, status, authority)
     VALUES ($1, $2, $3, 'pending', $4)
     RETURNING *`,
    [order.id, gateway, order.total, authority]
  );

  return {
    payment: rows[0],
    gateway,
    gateway_label: GATEWAY_LABELS[gateway] || gateway,
    authority,
    amount: Number(order.total),
    payment_url: `/payment/${order.code}?authority=${authority}`,
  };
}

/** Verifies a mock payment and marks the order as paid. */
export async function settlePayment({ order, authority, success }) {
  const { rows } = await query(
    `SELECT * FROM payments
     WHERE order_id = $1 AND ($2::text = '' OR authority = $2)
     ORDER BY id DESC LIMIT 1`,
    [order.id, authority || '']
  );
  const payment = rows[0];
  if (!payment) return { ok: false, error: 'تراکنش یافت نشد.' };
  if (payment.status === 'paid') {
    return { ok: true, already: true, ref_id: payment.ref_id, payment };
  }

  if (!success) {
    await query("UPDATE payments SET status = 'failed' WHERE id = $1", [payment.id]);
    await query("UPDATE orders SET payment_status = 'failed', updated_at = now() WHERE id = $1", [order.id]);
    return { ok: false, failed: true, error: 'پرداخت ناموفق بود یا لغو شد.' };
  }

  const refId = mockRefId();
  await query(
    `UPDATE payments SET status = 'paid', ref_id = $1, paid_at = now() WHERE id = $2`,
    [refId, payment.id]
  );
  await query(
    `UPDATE orders
     SET payment_status = 'paid',
         status = CASE WHEN status = 'pending' THEN 'confirmed' ELSE status END,
         updated_at = now()
     WHERE id = $1`,
    [order.id]
  );

  return { ok: true, ref_id: refId, payment: { ...payment, status: 'paid', ref_id: refId } };
}
