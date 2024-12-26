import { Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useEffect } from 'react';

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, checkAuth } = useStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};
