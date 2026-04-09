import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080', // ajuste para o endereço do seu backend
  withCredentials: true,
});

export async function getUsers() {
  const response = await api.get('/users');
  return response.data;
}
