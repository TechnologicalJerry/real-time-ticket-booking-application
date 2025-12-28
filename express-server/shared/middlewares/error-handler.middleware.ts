import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '../utils/response.util';
import { logger } from '../utils/logger.util';
import { HTTP_STATUS } from '../constants/http-status.constants';

export class ErrorHandlerMiddleware {
  static handle(error: Error, req: Request, res: Response, next: NextFunction): Response {
    logger.error('Error occurred:', error.message, error.stack);

    if (error.name === 'ValidationError') {
      return ResponseUtil.badRequest(res, 'Validation error', error.message);
    }

    if (error.name === 'UnauthorizedError') {
      return ResponseUtil.unauthorized(res, error.message);
    }

    if (error.name === 'NotFoundError') {
      return ResponseUtil.notFound(res, error.message);
    }

    return ResponseUtil.error(
      res,
      'Internal server error',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      process.env.NODE_ENV === 'development' ? error.message : undefined
    );
  }
}

