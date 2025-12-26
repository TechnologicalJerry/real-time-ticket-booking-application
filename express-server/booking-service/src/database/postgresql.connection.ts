import { Pool } from 'pg';
import { config } from '../config/env';
import { logger } from '../../shared/utils/logger.util';

const pool = new Pool({
  host: config.postgresql.host,
  port: config.postgresql.port,
  database: config.postgresql.database,
  user: config.postgresql.username,
  password: config.postgresql.password,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  logger.info('PostgreSQL connected');
});

pool.on('error', (error) => {
  logger.error('PostgreSQL pool error:', error);
});

export const query = async (text: string, params?: any[]): Promise<any> => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    logger.error('Query error:', error);
    throw error;
  }
};

export const getClient = async () => {
  return pool.connect();
};

export const initDatabase = async (): Promise<void> => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        event_id INTEGER NOT NULL,
        seat_id INTEGER NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        total_amount DECIMAL(10, 2) NOT NULL,
        booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    logger.info('Booking table initialized');
  } catch (error) {
    logger.error('Database initialization error:', error);
    throw error;
  }
};

export default pool;

