import axios from 'axios';
import Cookies from 'js-cookie';
import { store } from '../redux/store';
import { logout } from '../redux/slices/authSlice';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token || Cookies.get('token') || '';

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        store.dispatch(logout());
        window.location.href = '/login';
      }

      if (error.response.status === 403) {
        const mensagem =
          typeof error.response.data === 'string'
            ? error.response.data
            : 'Você não possui permissão para acessar este recurso.';

        alert(mensagem);
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  },
);

export default api;