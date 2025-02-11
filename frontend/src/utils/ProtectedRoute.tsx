import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RoleService } from './Utils';
import { toast } from 'react-toastify';

const ProtectedRoute: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <></>;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

export const DashboardProtectedRoute: React.FC = () => {
  const { user, isLoading } = useAuth();
  const roleService = new RoleService();


  if (isLoading) {
    return <></>;
  }

  if (user && roleService.hasRole('ROLE_OWNER')) {
    return <Outlet />;
  }

  toast.warn('You are not authorized to access this page');
  return <Navigate to="/" replace />;
};
