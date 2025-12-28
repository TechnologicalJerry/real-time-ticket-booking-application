import { UserRepository } from './user.repository';
import { User, CreateUserDto, UpdateUserDto } from './user.entity';
import { ServiceResponse } from '../../../shared/types/common.types';
import { HTTP_STATUS } from '../../../shared/constants/http-status.constants';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers(): Promise<ServiceResponse<User[]>> {
    try {
      const users = await this.userRepository.findAll();
      return {
        success: true,
        data: users,
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch users',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async getUserById(id: number): Promise<ServiceResponse<User>> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        return {
          success: false,
          error: 'User not found',
          statusCode: HTTP_STATUS.NOT_FOUND,
        };
      }
      return {
        success: true,
        data: user,
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch user',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async createUser(userData: CreateUserDto): Promise<ServiceResponse<User>> {
    try {
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        return {
          success: false,
          error: 'User with this email already exists',
          statusCode: HTTP_STATUS.CONFLICT,
        };
      }

      const user = await this.userRepository.create(userData);
      return {
        success: true,
        data: user,
        statusCode: HTTP_STATUS.CREATED,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create user',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async updateUser(id: number, userData: UpdateUserDto): Promise<ServiceResponse<User>> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        return {
          success: false,
          error: 'User not found',
          statusCode: HTTP_STATUS.NOT_FOUND,
        };
      }

      if (userData.email) {
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser && existingUser.id !== id) {
          return {
            success: false,
            error: 'Email already in use',
            statusCode: HTTP_STATUS.CONFLICT,
          };
        }
      }

      const updatedUser = await this.userRepository.update(id, userData);
      return {
        success: true,
        data: updatedUser!,
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update user',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async deleteUser(id: number): Promise<ServiceResponse<void>> {
    try {
      const deleted = await this.userRepository.delete(id);
      if (!deleted) {
        return {
          success: false,
          error: 'User not found',
          statusCode: HTTP_STATUS.NOT_FOUND,
        };
      }
      return {
        success: true,
        statusCode: HTTP_STATUS.NO_CONTENT,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete user',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }
}

