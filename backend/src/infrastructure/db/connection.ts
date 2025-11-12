import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const config: PoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'fueleu_db',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // SSL is required for cloud databases like Render
  ssl: process.env.DB_SSL === 'true' || process.env.DB_HOST?.includes('render.com') 
    ? { rejectUnauthorized: false } 
    : undefined,
};

if (!config.user || !config.password) {
  throw new Error('DB_USER and DB_PASSWORD must be set in .env file');
}

export const dbPool = new Pool(config);

