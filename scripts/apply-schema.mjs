// Aplica db/schema.sql no banco apontado por DATABASE_URL.
// Uso: npm run db:schema
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import pg from 'pg';

const here = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(here, '..', 'db', 'schema.sql');

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL não definida.');
  process.exit(1);
}

const sql = await readFile(schemaPath, 'utf8');
const client = new pg.Client({ connectionString: url });

try {
  await client.connect();
  await client.query(sql);
  console.log('Esquema aplicado com sucesso.');
} catch (err) {
  console.error('Falha ao aplicar o esquema:', err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
