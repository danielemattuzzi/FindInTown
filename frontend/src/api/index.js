import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://findintown.onrender.com', // URL of the deployed backend server
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
