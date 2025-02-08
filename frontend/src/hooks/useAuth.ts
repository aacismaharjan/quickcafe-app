import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { API_SERVER } from '../utils/AxiosInstance';
import { useLoading } from '../context/LoadingContext';
import { useNavigate } from 'react-router-dom';

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
  accessToken: string;
  refreshToken: string;
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
      const tokenData = localStorage.getItem('accessToken');
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

      const { accessToken, refreshToken, user } = response.data;
      if (accessToken && user) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        setUser(user);
        toast.success('Login successful!');
        navigate('/');
      }
    } catch (error) {
      const authError = (error as AxiosError<AuthError>).response?.data;
      const { message } = authError || {};
      toast.error(`${message}`);
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

      const { user } = response.data;
      if (user) {
        setUser(user);
        toast.success('Registration completed. Please verify your email to login.');
        navigate('/');
      }
    } catch (error) {
      const authError = (error as AxiosError<AuthError>).response?.data;
      const { message } = authError || {};
      toast.error(`${message}`);
    }
  };

  const verify = async (accessToken: string) => {
    try {
      await axios.post<AuthResponse>(`${API_SERVER}/api/v1/auth/verify`, {
        accessToken,
      });
      return true;
    } catch {
      return false;
    }
  };

  const refresh = async () =>  {
    const refreshToken = localStorage.getItem('refreshToken');
  
    if (!refreshToken) return null;

    try {
      const response = await axios.post(`${API_SERVER}/api/v1/auth/refresh`, {refreshToken});
      localStorage.setItem('accessToken', response.data.accessToken);
      return response.data.accessToken;
    }catch {
      logout();
      return null;
    }
  }

  const logout = (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    setUser(null);
    toast.info('Logged out successfully.');
    navigate('/login');
  };

  return { user, login,refresh, register,verify, logout, token, isLoading };
};
