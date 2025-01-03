import axios from 'axios';
import { toast } from 'react-toastify';

export const API_SERVER = 'http://localhost:8080';
// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: `${API_SERVER}/api/v1`, // Set the base URL for your API
});

// Intercept requests to add the token from localStorage
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Get token from localStorage
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; // Add token to headers
  }
  return config;
});

// Intercept responses to handle errors
axiosInstance.interceptors.response.use(
  (response) => response, // Pass successful responses through without modification
  (error) => {
    if (error.response) {
      // Check for token expiration or invalid token
      if (error.response.status === 401 || error.response.status === 403) {
        localStorage.removeItem('token'); // Clear token if status is 401 or 403
        window.location.href = '/login'; // Redirect to login page
        toast.info('Token is expired. Please login again.');
      }

      // Handle server error (500) as well
      // if (error.response.status === 500) {
      //   toast.error('Server error occurred.');
      //   // Optionally handle server error
      // }
    } else {
      // Handle other errors (like network issues)
      toast.error('An error occurred:' + error.message);
    }

    return Promise.reject(error); // Reject the promise to handle the error
  }
);

export default axiosInstance;
