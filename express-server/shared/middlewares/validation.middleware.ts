import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '../utils/response.util';

export class ValidationMiddleware {
  static validate(schema: any) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const { error } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        const errors = error.details.map((detail: any) => detail.message).join(', ');
        ResponseUtil.badRequest(res, 'Validation error', errors);
        return;
      }

      next();
    };
  }
}

