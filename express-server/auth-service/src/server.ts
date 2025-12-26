import { createApp } from './app';
import { config } from './config/env';
import { logger } from '../../shared/utils/logger.util';

const startServer = async () => {
  try {
    const app = await createApp();
    const server = app.listen(config.port, () => {
      logger.info(`Auth Service running on port ${config.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
    });

    process.on('SIGTERM', () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
      });
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

