import { Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useEffect, useState } from 'react';
import LoadingSpinner from "./ui/LoadingSpinner.tsx";

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
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};
