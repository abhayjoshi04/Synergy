export type Role = 'NORMAL' | 'SCHOOL_ADMIN' | 'SUPER_ADMIN' | 'POLICY_MAKER' | 'SUPPORT_STAFF' | 'AUDITOR';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  verified: boolean;
  approved: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  captcha: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: Role;
  documents?: File[];
}