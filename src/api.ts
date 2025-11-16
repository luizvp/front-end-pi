// api.ts
//https://api.luizvieira.xyz/api/
//http://localhost:8000/api/
import axios, { AxiosInstance } from 'axios';

// Create an Axios instance with a base URL
const api: AxiosInstance = axios.create({
  baseURL: 'https://clinica.pi.laharl.xyz/api/',  // Replace with your base URL
});

export default api;
