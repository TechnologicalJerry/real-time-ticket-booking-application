import mysql from 'mysql2/promise';
import { config } from '../config/env';
import { logger } from '../../shared/utils/logger.util';

let pool: mysql.Pool;

export const createPool = (): mysql.Pool => {
  if (!pool) {
    pool = mysql.createPool({
      host: config.mysql.host,
      port: config.mysql.port,
      database: config.mysql.database,
      user: config.mysql.username,
      password: config.mysql.password,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
};

export const query = async (sql: string, params?: any[]): Promise<any> => {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } finally {
    connection.release();
  }
};

export const initDatabase = async (): Promise<void> => {
  try {
    pool = createPool();
    await query(`
      CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        venue VARCHAR(255),
        date DATETIME NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        total_seats INT NOT NULL,
        available_seats INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    logger.info('Event table initialized');
  } catch (error) {
    logger.error('Database initialization error:', error);
    throw error;
  }
};

export default pool;

