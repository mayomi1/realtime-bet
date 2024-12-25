import React, { useEffect } from 'react';
import { Toaster } from 'sonner'

import { useStore } from './store/useStore';
import { LoginForm } from './components/LoginForm';
import { GamesList } from './components/GamesList';
import { Leaderboard } from './components/Leaderboard';
import { BetHistory } from './components/BetHistory';
import { UserProfile } from './components/UserProfile';
import { ErrorBoundary } from './components/ErrorBoundary';

const App: React.FC = () => {
  const { user, initializeSocket, cleanup } = useStore();

  useEffect(() => {
    if (user) {
      initializeSocket();
      return () => cleanup();
    }
  }, [initializeSocket, user]);

  if (!user) {
    return (
      <ErrorBoundary>
        <LoginForm />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Toaster position="top-right"/>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-6xl mx-auto">
          <UserProfile />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BetHistory />
            <GamesList />
            <div className="space-y-4">
              <Leaderboard />
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;

