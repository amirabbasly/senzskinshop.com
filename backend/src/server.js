import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import { initDb, migrate, closeDb } from './db.js';
import { seed } from './seed.js';
import publicRoutes from './routes/public.js';
import adminRoutes from './routes/admin.js';
import customerRoutes from './routes/customer.js';
import paymentRoutes from './routes/payments.js';
import { requireAdmin } from './auth.js';

const app = express();
const PORT = Number(process.env.PORT || 4000);
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

app.set('trust proxy', 1);
app.disable('x-powered-by');

const origins = (process.env.CORS_ORIGIN || '*').split(',').map((s) => s.trim());
app.use(
  cors({
    origin: origins.includes('*') ? true : origins,
    credentials: true,
  })
);
app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ extended: true }));

/** Very small in-memory rate limiter (per IP) for sensitive endpoints. */
function rateLimit({ windowMs = 60_000, max = 20, message }) {
  const hits = new Map();
  return (req, res, next) => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    const entry = hits.get(key);
    if (!entry || now > entry.reset) {
      hits.set(key, { count: 1, reset: now + windowMs });
      if (hits.size > 5000) hits.clear();
      return next();
    }
    entry.count += 1;
    if (entry.count > max) {
      return res.status(429).json({
        error: message || 'تعداد درخواست‌های شما زیاد است. لطفاً چند دقیقه بعد دوباره تلاش کنید.',
      });
    }
    return next();
  };
}

app.use('/api/auth/login', rateLimit({ windowMs: 10 * 60_000, max: 20 }));
app.use('/api/customer/login', rateLimit({ windowMs: 10 * 60_000, max: 30 }));
app.use('/api/customer/register', rateLimit({ windowMs: 60 * 60_000, max: 15 }));
app.use('/api/orders', rateLimit({ windowMs: 10 * 60_000, max: 60 }));
app.use('/api/newsletter', rateLimit({ windowMs: 60 * 60_000, max: 10 }));

app.use(
  '/uploads',
  express.static(UPLOAD_DIR, {
    maxAge: '30d',
    fallthrough: true,
    setHeaders: (res) => res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'),
  })
);

app.get('/', (req, res) =>
  res.json({
    name: 'SENZ SKIN SHOP API',
    version: '1.0.0',
    docs: '/api/health',
  })
);

app.use('/api/customer', customerRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api', publicRoutes);
app.use('/api/admin', requireAdmin, adminRoutes);

app.use((req, res) => res.status(404).json({ error: 'مسیر مورد نظر یافت نشد.' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[api error]', err.message);
  const status = err.status || (err.code === 'LIMIT_FILE_SIZE' ? 413 : 500);
  res.status(status).json({
    error:
      status === 500
        ? 'خطای غیرمنتظره در سرور رخ داد. لطفاً دوباره تلاش کنید.'
        : err.message || 'درخواست نامعتبر است.',
  });
});

async function bootstrap() {
  await initDb();
  await migrate();
  if (process.env.SEED_ON_BOOT !== '0') {
    try {
      await seed();
    } catch (err) {
      console.error('[seed] failed:', err.message);
    }
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[api] SENZ API listening on http://0.0.0.0:${PORT}`);
  });

  const shutdown = async (signal) => {
    console.log(`[api] ${signal} received, shutting down…`);
    server.close(async () => {
      await closeDb();
      process.exit(0);
    });
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  console.error('[api] failed to start:', err);
  process.exit(1);
});

export default app;
