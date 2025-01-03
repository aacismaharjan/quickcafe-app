import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_SERVER } from '../utils/AxiosInstance';
import { useLoading } from '../context/LoadingContext';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  enabled: boolean;
  username: string;
  authorities: { authority: string }[];
  credentialsNonExpired: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthError {
  statusCode?: number;
  message?: string;
  details?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setLoading } = useLoading();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(isLoading);
  }, [setLoading, isLoading]);

  useEffect(() => {
    const initializeAuth = async () => {
      const tokenData = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (userData && tokenData) {
        const tempUser: User = JSON.parse(userData);
        const tempToken = tokenData;
        setUser(tempUser);
        setToken(tempToken);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await axios.post<AuthResponse>(`${API_SERVER}/api/v1/auth/authenticate`, {
        email,
        password,
      });

      const { token, user } = response.data;
      if (token && user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        toast.success('Login successful!');
        navigate('/');
      }
    } catch (error) {
      const authError = (error as AxiosError<AuthError>).response?.data;
      const { statusCode, message, details } = authError || {};
      toast.error(`Error ${statusCode || ''}: ${message || ''} - ${details || 'Check your credentials'}`);
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string): Promise<void> => {
    try {
      const response = await axios.post<AuthResponse>(`${API_SERVER}/api/v1/auth/register`, {
        firstName,
        lastName,
        email,
        password,
      });

      const { token, user } = response.data;
      if (token && user) {
        localStorage.setItem('token', token);
        localStorage.setItem('token', JSON.stringify(user));
        setUser(user);
        toast.success('Registration successful!');
        navigate('/');
      }
    } catch (error) {
      const authError = (error as AxiosError<AuthError>).response?.data;
      const { statusCode, message, details } = authError || {};
      toast.error(`Error ${statusCode || ''}: ${message || ''} - ${details || 'Unable to register'}`);
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.info('Logged out successfully.');
    navigate('/login');
  };

  return { user, login, register, logout, token, isLoading };
};
