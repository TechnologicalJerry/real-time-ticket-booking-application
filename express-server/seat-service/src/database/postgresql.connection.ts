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
      CREATE TABLE IF NOT EXISTS seats (
        id SERIAL PRIMARY KEY,
        event_id INTEGER NOT NULL,
        seat_number VARCHAR(50) NOT NULL,
        row_number VARCHAR(10),
        section VARCHAR(50),
        status VARCHAR(20) DEFAULT 'available',
        price DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(event_id, seat_number)
      )
    `);
    logger.info('Seat table initialized');
  } catch (error) {
    logger.error('Database initialization error:', error);
    throw error;
  }
};

export default pool;

