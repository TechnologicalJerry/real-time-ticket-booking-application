import { Request, Response } from 'express';
import { AuthService, LoginCredentials, RegisterData } from './auth.service';
import { ResponseUtil } from '../../../shared/utils/response.util';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response): Promise<Response> => {
    const data: RegisterData = req.body;
    const result = await this.authService.register(data);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Registration failed', result.statusCode);
    }

    return ResponseUtil.created(res, result.data, 'User registered successfully');
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    const credentials: LoginCredentials = req.body;
    const result = await this.authService.login(credentials);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Login failed', result.statusCode);
    }

    return ResponseUtil.success(res, result.data, 'Login successful');
  };

  validate = async (req: Request, res: Response): Promise<Response> => {
    const token = req.headers.authorization?.substring(7);

    if (!token) {
      return ResponseUtil.unauthorized(res, 'No token provided');
    }

    const result = await this.authService.validateToken(token);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Token validation failed', result.statusCode);
    }

    return ResponseUtil.success(res, result.data, 'Token is valid');
  };
}

