import { readFileSync } from 'fs';
import { join } from 'path';
import { dbPool } from './connection';

async function migrate() {
  try {
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
    await dbPool.query(schema);
    console.log('✅ Database migration completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await dbPool.end();
  }
}

migrate();

