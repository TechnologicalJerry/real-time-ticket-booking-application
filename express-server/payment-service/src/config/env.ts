import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PAYMENT_SERVICE_PORT || '3006', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  postgresql: {
    host: process.env.POSTGRESQL_HOST || 'localhost',
    port: parseInt(process.env.POSTGRESQL_PORT || '5432', 10),
    database: process.env.POSTGRESQL_DATABASE || 'payment_service',
    username: process.env.POSTGRESQL_USERNAME || 'postgres',
    password: process.env.POSTGRESQL_PASSWORD || 'postgres',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
  },
};

