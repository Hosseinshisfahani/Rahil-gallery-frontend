export interface AuthTokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  refresh_expires_in: number;
}

export interface AuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
}

export interface AuthSuccessEnvelope<T> {
  success: true;
  data: T;
}

export interface AuthErrorEnvelope {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export interface LoginInput {
  email: string;
  password: string;
}
