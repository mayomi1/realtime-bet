import React from 'react';
import { useStore } from '../store/useStore';
import {LeaderboardEntry} from "../types/api.ts";

export const Leaderboard: React.FC = () => {
  const { leaderboard } = useStore();

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
      <div className="space-y-2">
        {(leaderboard as LeaderboardEntry[]).map((entry, index) => (
          <div
            key={entry.userId}
            className="flex justify-between items-center p-2 hover:bg-gray-50"
          >
            <div className="flex items-center">
              <span className="w-8 text-gray-500">{index + 1}.</span>
              <span className="font-medium">{entry.userName}</span>
            </div>
            <span className="text-green-600 font-medium">
              {entry.points.toLocaleString()} pts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
