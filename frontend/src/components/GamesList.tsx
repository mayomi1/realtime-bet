import React from 'react';
import { useStore } from '../store/useStore';
import { BetForm } from './BetForm';

export const GamesList: React.FC = () => {
  const { games } = useStore();

  return (
    <div className="space-y-4">
      {games.map(game => (
        <div key={game.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-bold">
              {game.team1} vs {game.team2}
            </div>
            <div className="text-sm text-gray-500">
              {game.timeRemaining}
            </div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-2xl font-bold">
              {game.score1} - {game.score2}
            </div>
            <div className="text-sm">
              <span className="mr-4">1: {game.odds1.toFixed(2)}</span>
              <span>2: {game.odds2.toFixed(2)}</span>
            </div>
          </div>
          {game.status === 'LIVE' && (
            <BetForm gameId={game.id} />
          )}
        </div>
      ))}
    </div>
  );
};
