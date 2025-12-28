import { Request, Response } from 'express';
import { ApiResponse } from '../types/common.types';
import { HTTP_STATUS } from '../constants/http-status.constants';

export class ResponseUtil {
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = HTTP_STATUS.OK
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
    };
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string = 'An error occurred',
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    error?: string
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      error: error || message,
    };
    return res.status(statusCode).json(response);
  }

  static created<T>(
    res: Response,
    data: T,
    message: string = 'Resource created successfully'
  ): Response {
    return this.success(res, data, message, HTTP_STATUS.CREATED);
  }

  static notFound(res: Response, message: string = 'Resource not found'): Response {
    return this.error(res, message, HTTP_STATUS.NOT_FOUND);
  }

  static badRequest(res: Response, message: string = 'Bad request', error?: string): Response {
    return this.error(res, message, HTTP_STATUS.BAD_REQUEST, error);
  }

  static unauthorized(res: Response, message: string = 'Unauthorized'): Response {
    return this.error(res, message, HTTP_STATUS.UNAUTHORIZED);
  }

  static forbidden(res: Response, message: string = 'Forbidden'): Response {
    return this.error(res, message, HTTP_STATUS.FORBIDDEN);
  }
}

