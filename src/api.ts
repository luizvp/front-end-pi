// api.ts
import axios, { AxiosInstance } from 'axios';

// Create an Axios instance with a base URL
const api: AxiosInstance = axios.create({
  baseURL: 'https://back-end-pi-iota.vercel.app/api/api/',  // Replace with your base URL
});

export default api;
