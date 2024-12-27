import { Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useEffect, useState } from 'react';

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, checkAuth, fetchBets } = useStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await checkAuth();
        await fetchBets();
        setIsInitialized(true);
      } catch (error) {
        console.error('Authentication error:', error);
        setIsInitialized(true);
      }
    };

    initialize();
  }, [checkAuth, fetchBets]);

  if (!isInitialized || isLoading) {
    return <div>Loading...</div>;
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};
