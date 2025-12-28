import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.USER_SERVICE_PORT || '3002', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  postgresql: {
    host: process.env.POSTGRESQL_HOST || 'localhost',
    port: parseInt(process.env.POSTGRESQL_PORT || '5432', 10),
    database: process.env.POSTGRESQL_DATABASE || 'user_service',
    username: process.env.POSTGRESQL_USERNAME || 'postgres',
    password: process.env.POSTGRESQL_PASSWORD || 'postgres',
  },
};

