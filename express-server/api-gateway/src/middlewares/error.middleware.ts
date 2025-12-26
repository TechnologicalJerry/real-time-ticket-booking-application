import { Request, Response, NextFunction } from 'express';
import { ErrorHandlerMiddleware } from '../../shared/middlewares/error-handler.middleware';

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  return ErrorHandlerMiddleware.handle(error, req, res, next);
};

