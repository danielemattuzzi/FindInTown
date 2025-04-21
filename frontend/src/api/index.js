import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000', // URL of the backend server
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adding a request interceptor to include the token in the headers
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
