export type UserRole = "admin" | "reporter";

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  agency?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SafeUser = Omit<UserEntity, "password">;

export interface UserSession {
  user: SafeUser;
  token: string;
  expiresIn: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  agency?: string;
  phone?: string;
}
