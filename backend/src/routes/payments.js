import { Router } from 'express';
import { query } from '../db.js';
import { wrap } from '../helpers.js';
import { activeGateway, createPaymentForOrder, settlePayment, GATEWAY_LABELS } from '../payments.js';

const router = Router();

async function findOrder(code) {
  const { rows } = await query('SELECT * FROM orders WHERE code = $1', [code]);
  return rows[0];
}

/** Creates (or reuses) a payment link for an online order. */
router.post('/start', wrap(async (req, res) => {
  const code = String(req.body?.code || '').trim();
  if (!code) return res.status(400).json({ error: 'کد سفارش را وارد کنید.' });

  const order = await findOrder(code);
  if (!order) return res.status(404).json({ error: 'سفارش یافت نشد.' });
  if (order.payment_status === 'paid')
    return res.status(400).json({ error: 'این سفارش قبلاً پرداخت شده است.' });
  if (order.status === 'cancelled')
    return res.status(400).json({ error: 'این سفارش لغو شده است.' });

  const { rows: pending } = await query(
    `SELECT * FROM payments WHERE order_id = $1 AND status = 'pending' ORDER BY id DESC LIMIT 1`,
    [order.id]
  );

  if (pending.length) {
    const payment = pending[0];
    return res.json({
      ok: true,
      gateway: payment.gateway,
      gateway_label: GATEWAY_LABELS[payment.gateway] || payment.gateway,
      authority: payment.authority,
      amount: Number(payment.amount),
      payment_url: `/payment/${order.code}?authority=${payment.authority}`,
    });
  }

  const result = await createPaymentForOrder(order);
  if (order.payment_method !== 'online') {
    await query("UPDATE orders SET payment_method = 'online' WHERE id = $1", [order.id]);
  }
  res.json({ ok: true, ...result });
}));

/** Status of the latest payment + order state (used by the payment page). */
router.get('/status/:code', wrap(async (req, res) => {
  const order = await findOrder(req.params.code);
  if (!order) return res.status(404).json({ error: 'سفارش یافت نشد.' });
  const { rows } = await query(
    `SELECT gateway, amount, status, ref_id, authority, paid_at FROM payments
     WHERE order_id = $1 ORDER BY id DESC LIMIT 1`,
    [order.id]
  );
  res.json({
    order_code: order.code,
    order_status: order.status,
    payment_status: order.payment_status,
    amount: Number(order.total),
    gateway: activeGateway(),
    payment: rows[0] || null,
  });
}));

/**
 * Mock gateway callback.
 * In a real integration this endpoint becomes /payment/callback and calls the
 * PSP verify API with the authority/track id before settling the order.
 */
router.post('/mock/complete', wrap(async (req, res) => {
  const { code, authority, success } = req.body || {};
  const order = await findOrder(String(code || '').trim());
  if (!order) return res.status(404).json({ error: 'سفارش یافت نشد.' });

  const result = await settlePayment({ order, authority, success: Boolean(success) });

  if (!result.ok) {
    return res.status(result.failed ? 402 : 404).json({
      error: result.error || 'پرداخت انجام نشد.',
      payment_status: 'failed',
      order_code: order.code,
    });
  }

  res.json({
    ok: true,
    already: Boolean(result.already),
    ref_id: result.ref_id,
    order_code: order.code,
    payment_status: 'paid',
    message: 'پرداخت با موفقیت انجام شد.',
  });
}));

export default router;
