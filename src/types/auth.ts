export type RoleType = "public" | "authenticated" | "admin";

export interface UserRole {
  id: number;
  name: string;
  type: RoleType;
  description?: string;
}

export interface User {
  user: { id: number; type: "authenticated"; name: string; };
  id: number;
  username: string;
  email: string;
  tel: string;
  contact_email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  firstname: string;
  lastname: string;
  isComplete: boolean;
  isActive: boolean;
  token?: string;
  role?: UserRole;
}

export type AuthStatus = "loading" | "authorized" | "unauthorized";

export type AuthContextType = {
  user: User | undefined;
  status: 'loading' | 'authorized' | 'unauthorized';
  token: string | null;
  updateAuthStatus: (newStatus: AuthStatus, userData?: User, token?: string | null) => void;
  isLoading?: boolean;
};

export interface GetUserDataResult {
  user: User | null;
  error: string | null;
}

export interface NationalityData {
  num_code: string;
  alpha_2_code: string;
  alpha_3_code: string;
  en_short_name: string;
  nationality: string;
}