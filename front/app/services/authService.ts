import api from "./api";
import { LoginRequest, LoginResponse } from "../types/auth";

export async function loginService(
  login: LoginRequest,
): Promise<LoginResponse> {
  var loginResult = await api.post<LoginResponse>("/auth/login", login);

  return loginResult.data;
}