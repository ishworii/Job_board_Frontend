export type UserRole = 'job_seeker' | 'employer';

export interface AuthResponse {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}
