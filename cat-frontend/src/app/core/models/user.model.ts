export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token?: string; // Para futuras implementaciones con JWT
}

export interface LoginResponse extends User {}

export interface RegisterResponse extends User {}
