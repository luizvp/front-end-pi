// api.ts
import axios, { AxiosInstance } from 'axios';

// Create an Axios instance with a base URL
const api: AxiosInstance = axios.create({
  baseURL: 'https://api.luizvieira.xyz/api/',  // Replace with your base URL
});

export default api;
