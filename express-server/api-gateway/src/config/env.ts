import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.API_GATEWAY_PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  services: {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    user: process.env.USER_SERVICE_URL || 'http://localhost:3002',
    event: process.env.EVENT_SERVICE_URL || 'http://localhost:3003',
    seat: process.env.SEAT_SERVICE_URL || 'http://localhost:3004',
    booking: process.env.BOOKING_SERVICE_URL || 'http://localhost:3005',
    payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3006',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },
};

