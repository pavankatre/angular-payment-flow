export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  token?: string;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  VIEWER = 'viewer'
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  message: string;
  success: boolean;
}
