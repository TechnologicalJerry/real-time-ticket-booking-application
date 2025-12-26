import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { initDatabase } from './database/postgresql.connection';
import bookingRoutes from './modules/booking/booking.routes';
import { ErrorHandlerMiddleware } from '../../shared/middlewares/error-handler.middleware';
import { logger } from '../../shared/utils/logger.util';

export const createApp = async (): Promise<Express> => {
  const app = express();

  await initDatabase();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('combined'));

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'booking-service' });
  });

  app.use('/', bookingRoutes);

  app.use(ErrorHandlerMiddleware.handle);

  return app;
};

