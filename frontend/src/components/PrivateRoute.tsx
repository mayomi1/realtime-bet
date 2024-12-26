import { Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useStore();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};
