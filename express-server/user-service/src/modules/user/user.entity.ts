export interface User {
  id?: number;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateUserDto {
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
}

export interface UpdateUserDto {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
}

