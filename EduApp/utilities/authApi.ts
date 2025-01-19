import api from './api';

export interface AuthRequest {
  username: string;
  profileName: string;
  email: string;
  phone: string;
  type: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}



export interface AuthResponse {
  username: string;
  profileName: string;
  freemium: boolean;
  phone: string;
  email: string;
  type: string;
  token: string;
}

// Signup function

export const signup = async (data: AuthRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/user', data);
    return response.data;
  };

// Login function
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth', data);
  return response.data;
};
