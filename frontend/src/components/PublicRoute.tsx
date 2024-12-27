import { Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useEffect } from 'react';
import LoadingSpinner from "./ui/LoadingSpinner.tsx";

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, checkAuth } = useStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return !user ? <>{children}</> : <Navigate to="/dashboard" replace />;
};
