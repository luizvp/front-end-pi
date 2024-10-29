// api.ts
import axios, { AxiosInstance } from 'axios';

// Create an Axios instance with a base URL
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/',  // Replace with your base URL
});

export default api;
