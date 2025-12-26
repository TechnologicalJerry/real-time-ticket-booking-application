import { IUser, User } from './auth.model';

export class AuthRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email: email.toLowerCase() });
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  async create(userData: { email: string; password: string; role?: string }): Promise<IUser> {
    const user = new User({
      email: userData.email.toLowerCase(),
      password: userData.password,
      role: userData.role || 'user',
    });
    return user.save();
  }

  async update(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(id);
    return !!result;
  }
}

