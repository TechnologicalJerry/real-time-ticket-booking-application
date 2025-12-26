import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';
import { rateLimitMiddleware } from './middlewares/rate-limit.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import routes from './routes';
import { logger } from '../shared/utils/logger.util';

export const createApp = (): Express => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('combined'));
  app.use(rateLimitMiddleware);

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'api-gateway' });
  });

  app.use(routes);

  app.use(errorMiddleware);

  return app;
};

