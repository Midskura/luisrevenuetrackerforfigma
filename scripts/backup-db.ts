import { Client } from 'pg';
import 'dotenv/config';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const SUPABASE_DB_URL = process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL;

if (!SUPABASE_DB_URL) {
  throw new Error('Missing SUPABASE_DB_URL or DATABASE_URL for backup script');
}

const BACKUP_TABLES = [
  'organizations',
  'users',
  'projects',
  'units',
  'customers',
  'payment_schedules',
  'payments',
  'payment_intents',
  'documents',
  'activity_logs'
] as const;

const backupDir = join(process.cwd(), 'backups');

const formatTimestamp = () => {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, '-');
};

const run = async () => {
  await mkdir(backupDir, { recursive: true });
  const client = new Client({ connectionString: SUPABASE_DB_URL });
  await client.connect();

  try {
    const timestamp = formatTimestamp();

    for (const table of BACKUP_TABLES) {
      const { rows } = await client.query(`SELECT * FROM ${table} ORDER BY id NULLS FIRST`);
      const fileName = `${timestamp}-${table}.json`;
      const targetPath = join(backupDir, fileName);
      await writeFile(targetPath, JSON.stringify(rows, null, 2));
      console.log(`[backup] ${table} -> ${relative(process.cwd(), targetPath)}`);
    }
  } finally {
    await client.end();
  }
};

run()
  .then(() => {
    console.log('Backup completed successfully.');
  })
  .catch((error) => {
    console.error('Backup failed:', error);
    process.exit(1);
  });
