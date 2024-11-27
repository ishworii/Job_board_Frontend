import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roleRequired?: UserRole;
}

export const ProtectedRoute = ({ children, roleRequired }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roleRequired && user?.role !== roleRequired) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};
