import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const USE_PGLITE = process.env.USE_PGLITE === '1';

let pool = null;
let pglite = null;

/**
 * Local / CI mode uses PGlite (PostgreSQL compiled to WASM) so the API can run
 * without a database server. Production always uses a real PostgreSQL via `pg`.
 */
export async function initDb() {
  if (USE_PGLITE) {
    const { PGlite } = await import('@electric-sql/pglite');
    const dir = process.env.PGLITE_DIR || path.join(__dirname, '..', '.pgdata');
    pglite = new PGlite(dir);
    await pglite.waitReady;
    console.log('[db] PGlite (embedded postgres) ready →', dir);
  } else {
    const pg = (await import('pg')).default;
    pool = new pg.Pool({
      connectionString:
        process.env.DATABASE_URL ||
        'postgresql://senz:senz@localhost:5432/senzskinshop',
      max: Number(process.env.DB_POOL_SIZE || 10),
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });
    pool.on('error', (err) => console.error('[db] idle client error', err.message));
    await pool.query('SELECT 1');
    console.log('[db] PostgreSQL pool ready');
  }
}

export async function query(text, params = []) {
  if (pglite) {
    const res = await pglite.query(text, params);
    return { rows: res.rows, rowCount: res.rows.length };
  }
  return pool.query(text, params);
}

/** Runs a SQL script with several statements (migrations). */
export async function exec(sql) {
  if (pglite) {
    await pglite.exec(sql);
    return;
  }
  await pool.query(sql);
}

export async function withTransaction(fn) {
  if (pglite) {
    await pglite.query('BEGIN');
    try {
      const result = await fn({ query: (t, p = []) => query(t, p) });
      await pglite.query('COMMIT');
      return result;
    } catch (err) {
      await pglite.query('ROLLBACK');
      throw err;
    }
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn({ query: (t, p = []) => client.query(t, p) });
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function migrate() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await exec(schema);
  console.log('[db] schema is up to date');
}

export async function closeDb() {
  if (pglite) await pglite.close();
  if (pool) await pool.end();
  pglite = null;
  pool = null;
}
