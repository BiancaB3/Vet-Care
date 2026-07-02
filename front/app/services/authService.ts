import api from './api';
import type { LoginRequest, LoginResponse } from '../types/auth';

export async function loginService(
  login: LoginRequest,
): Promise<LoginResponse> {
  const loginResult = await api.post<LoginResponse>('/auth/login', login);

  return loginResult.data;
}