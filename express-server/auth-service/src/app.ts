import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectMongoDB } from './database/mongodb.connection';
import authRoutes from './modules/auth/auth.routes';
import { ErrorHandlerMiddleware } from '../../shared/middlewares/error-handler.middleware';
import { logger } from '../../shared/utils/logger.util';

export const createApp = async (): Promise<Express> => {
  const app = express();

  await connectMongoDB();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('combined'));

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'auth-service' });
  });

  app.use('/', authRoutes);

  app.use(ErrorHandlerMiddleware.handle);

  return app;
};

