import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.BOOKING_SERVICE_PORT || '3005', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  postgresql: {
    host: process.env.POSTGRESQL_HOST || 'localhost',
    port: parseInt(process.env.POSTGRESQL_PORT || '5432', 10),
    database: process.env.POSTGRESQL_DATABASE || 'booking_service',
    username: process.env.POSTGRESQL_USERNAME || 'postgres',
    password: process.env.POSTGRESQL_PASSWORD || 'postgres',
  },
  services: {
    event: process.env.EVENT_SERVICE_URL || 'http://localhost:3003',
    seat: process.env.SEAT_SERVICE_URL || 'http://localhost:3004',
    payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3006',
  },
};

