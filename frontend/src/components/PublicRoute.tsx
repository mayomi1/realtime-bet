import { Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useStore();
  return !user ? <>{children}</> : <Navigate to="/dashboard" replace />;
};
