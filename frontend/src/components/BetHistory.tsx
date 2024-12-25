import React from 'react';
import { useStore } from '../store/useStore';

export const BetHistory: React.FC = () => {
  const { bets, fetchBets } = useStore();

  const handleRefresh = () => {
    fetchBets();
  };
  return (
    <div className="bg-white p-4 rounded-lg shadow overflow-y-scroll h-[600px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Bet History</h2>
        <button
          onClick={handleRefresh}
          className="text-blue-500 hover:text-blue-600 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>
      <div className="space-y-2">
        {bets.map(bet => (
          <div
            key={bet.id}
            className="border-b last:border-0 py-2"
          >
            <div className="flex justify-between mb-1">
              <span className="font-medium">
                {bet.game?.team1} vs {bet.game?.team2}
              </span>
              <span className={`font-medium ${
                bet.status === 'WON' ? 'text-green-600' :
                  bet.status === 'LOST' ? 'text-red-600' :
                    'text-gray-600'
              }`}>
                {bet.status}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Amount: {bet.amount} @ {bet.odds}
              ({bet.team === 'team1' ? bet.game?.team1 : bet.game?.team2})
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
