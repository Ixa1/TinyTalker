import axios from 'axios';

// Use environment variable or fallback
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // 🔄 Check for both tokens
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('access_token'); // <-- change if using a different key

    const token = adminToken || userToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401 || status === 403) {
        console.warn('Unauthorized or session expired');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('access_token'); // optional: logout user too
        window.location.href = '/login'; // or '/user/login' if you separate
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
