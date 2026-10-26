import { Pool, type PoolClient } from 'pg';

// Um único pool por processo. Em serverless, o pool é recriado por instância, o que é aceitável para este volume.
let pool: Pool | null = null;

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
      // Supabase e a maioria dos provedores gerenciados exigem SSL. Desative só em desenvolvimento local.
      ssl: process.env.DATABASE_SSL === 'false' ? undefined : { rejectUnauthorized: false },
    });
  }
  return pool;
}

export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function query<R extends object = Record<string, unknown>>(text: string, params: unknown[] = []) {
  return getPool().query<R>(text, params);
}
