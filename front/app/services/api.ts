import axios from "axios";
import { store } from "../redux/store";
import { logout } from "../redux/slices/authSlice";

const FALLBACK_API_URL = "http://localhost:8080";

export function getApiErrorMessage(data: unknown, fallback: string): string {
  if (typeof data === "string" && data.trim().length > 0) {
    return data;
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof (data as { message?: unknown }).message === "string"
  ) {
    const message = (data as { message: string }).message.trim();
    if (message.length > 0) return message;
  }

  return fallback;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL?.trim() || FALLBACK_API_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;

    if (status === 401) {
      store.dispatch(logout());
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    if (status === 403) {
      const mensagem = getApiErrorMessage(
        data,
        "Voce nao possui permissao para acessar este recurso.",
      );

      if (typeof window !== "undefined") {
        console.warn(mensagem);
      }
    }

    return Promise.reject(error);
  },
);

export default api;