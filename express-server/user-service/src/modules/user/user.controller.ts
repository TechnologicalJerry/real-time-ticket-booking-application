import { Request, Response } from 'express';
import { UserService } from './user.service';
import { ResponseUtil } from '../../../shared/utils/response.util';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getAllUsers = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.userService.getAllUsers();

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to fetch users', result.statusCode);
    }

    return ResponseUtil.success(res, result.data, 'Users fetched successfully');
  };

  getUserById = async (req: Request, res: Response): Promise<Response> => {
    const id = parseInt(req.params.id, 10);
    const result = await this.userService.getUserById(id);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to fetch user', result.statusCode);
    }

    return ResponseUtil.success(res, result.data, 'User fetched successfully');
  };

  createUser = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.userService.createUser(req.body);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to create user', result.statusCode);
    }

    return ResponseUtil.created(res, result.data, 'User created successfully');
  };

  updateUser = async (req: Request, res: Response): Promise<Response> => {
    const id = parseInt(req.params.id, 10);
    const result = await this.userService.updateUser(id, req.body);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to update user', result.statusCode);
    }

    return ResponseUtil.success(res, result.data, 'User updated successfully');
  };

  deleteUser = async (req: Request, res: Response): Promise<Response> => {
    const id = parseInt(req.params.id, 10);
    const result = await this.userService.deleteUser(id);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to delete user', result.statusCode);
    }

    return res.status(204).send();
  };
}

