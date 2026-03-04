export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  role?: string;
  age?: number;
  address?: string;
  profile_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
  age?: number;
  address?: string;
  profile_url?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  age?: number;
  address?: string;
  profile_url?: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  age?: number;
  address?: string;
  profile_url?: string;
  created_at: Date;
  updated_at: Date;
}
