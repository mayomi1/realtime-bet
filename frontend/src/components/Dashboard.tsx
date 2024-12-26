import { useEffect , FC} from 'react';
import { useStore } from '../store/useStore';
import { GamesList } from './GamesList';
import { Leaderboard } from './Leaderboard';
import { BetHistory } from './BetHistory';
import { UserProfile } from './UserProfile';

export const Dashboard: FC = () => {
  const { initializeSocket, cleanup } = useStore();

  useEffect(() => {
    initializeSocket();
    return () => cleanup();
  }, [cleanup, initializeSocket]);

  return (
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
  );
};
