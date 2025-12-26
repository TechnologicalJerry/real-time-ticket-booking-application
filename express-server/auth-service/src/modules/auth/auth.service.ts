import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthRepository } from './auth.repository';
import { config } from '../../config/env';
import { ServiceResponse } from '../../../shared/types/common.types';
import { HTTP_STATUS } from '../../../shared/constants/http-status.constants';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  role?: string;
}

export interface AuthToken {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async register(data: RegisterData): Promise<ServiceResponse<AuthToken>> {
    try {
      const existingUser = await this.authRepository.findByEmail(data.email);
      if (existingUser) {
        return {
          success: false,
          error: 'User already exists',
          statusCode: HTTP_STATUS.CONFLICT,
        };
      }

      const hashedPassword = await bcrypt.hash(data.password, config.bcrypt.saltRounds);
      const user = await this.authRepository.create({
        email: data.email,
        password: hashedPassword,
        role: data.role,
      });

      const token = this.generateToken(user._id.toString(), user.email, user.role);

      return {
        success: true,
        data: {
          token,
          user: {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
          },
        },
        statusCode: HTTP_STATUS.CREATED,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Registration failed',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async login(credentials: LoginCredentials): Promise<ServiceResponse<AuthToken>> {
    try {
      const user = await this.authRepository.findByEmail(credentials.email);
      if (!user) {
        return {
          success: false,
          error: 'Invalid credentials',
          statusCode: HTTP_STATUS.UNAUTHORIZED,
        };
      }

      const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          error: 'Invalid credentials',
          statusCode: HTTP_STATUS.UNAUTHORIZED,
        };
      }

      const token = this.generateToken(user._id.toString(), user.email, user.role);

      return {
        success: true,
        data: {
          token,
          user: {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
          },
        },
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Login failed',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async validateToken(token: string): Promise<ServiceResponse<any>> {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as {
        id: string;
        email: string;
        role: string;
      };

      const user = await this.authRepository.findById(decoded.id);
      if (!user) {
        return {
          success: false,
          error: 'User not found',
          statusCode: HTTP_STATUS.NOT_FOUND,
        };
      }

      return {
        success: true,
        data: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        },
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error: any) {
      return {
        success: false,
        error: 'Invalid token',
        statusCode: HTTP_STATUS.UNAUTHORIZED,
      };
    }
  }

  private generateToken(id: string, email: string, role: string): string {
    return jwt.sign({ id, email, role }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }
}

