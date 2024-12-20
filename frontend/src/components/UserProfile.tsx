import React from 'react';
import { useStore } from '../store/useStore';

export const UserProfile: React.FC = () => {
  const { user, logout } = useStore();

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{user?.username}</h2>
          <p className="text-gray-600">{user?.email}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Available Points</p>
          <p className="text-2xl font-bold text-green-600">
            {user?.points.toLocaleString()}
          </p>
        </div>
        <button
          type="button"
          onClick={() => logout()}
          // disabled={isLoading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Logout
        </button>

      </div>
    </div>
  );
};
