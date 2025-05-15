import axios from 'axios';

// Use environment variable or fallback
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';


const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (for global errors)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401 || status === 403) {
        console.warn('Unauthorized or session expired');
        localStorage.removeItem('adminToken');
        window.location.href = '/login';
      }

      // Optionally: show toast here using react-toastify
      // toast.error(error.response.data?.detail || "Something went wrong");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
