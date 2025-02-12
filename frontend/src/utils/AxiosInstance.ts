import axios from 'axios';
import { toast } from 'react-toastify';


// Turn on for local device
// const SERVER = "http://127.0.0.1";

// Turn on for local network
// const SERVER = "http://192.168.100.41";
export const API_SERVER = "https://quickcafe-app-production.up.railway.app";

// export const API_SERVER = `${SERVER}:8080`;

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: `${API_SERVER}/api/v1`, // Set the base URL for your API
});

// Intercept requests to add the token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken'); // Get token from localStorage
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`; // Add token to headers
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to handle errors
axiosInstance.interceptors.response.use(
  (response) => response, // Pass successful responses through without modification
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          return new Error('No refresh token available');
        }

        const response = await axios.post(`${API_SERVER}/api/v1/auth/refresh`, { refreshToken });
        // Save new token and retry original request
        localStorage.setItem('accessToken', response.data.accessToken);
        originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed: ', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login'; // Redirect to login page
      }
    }

    if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        localStorage.removeItem('token'); // Clear token if status is 401 or 403
        window.location.href = '/login'; // Redirect to login page
        toast.info('Token is expired. Please login again.');
      }
    } else {
      // Handle other errors (like network issues)
      toast.error('An error occurred:' + error.message);
    }

    return Promise.reject(error); // Reject the promise to handle the error
  }
);

export default axiosInstance;
