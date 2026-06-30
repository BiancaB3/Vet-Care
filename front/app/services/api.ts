import axios from "axios";
import { store } from "../redux/store";
import { logout } from "../redux/slices/authSlice";

const api = axios.create({
  baseURL: "http://localhost:8080", // ajuste se no VetCare usar variável de ambiente
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
      window.location.href = "/login";
    }

    if (status === 403) {
      const mensagem =
        typeof data === "string"
          ? data
          : "Você não possui permissão para acessar este recurso.";

      alert(mensagem);
      window.location.href = "/";
    }

    return Promise.reject(error);
  },
);

export default api;