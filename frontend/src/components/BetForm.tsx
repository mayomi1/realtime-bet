import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import {toast} from "sonner";

interface Props {
  gameId: string;
}

export const BetForm: React.FC<Props> = ({ gameId }) => {
  const [amount, setAmount] = useState('');
  const [team, setTeam] = useState<'team1' | 'team2'>('team1');
  const { placeBet, isPlaceBetLoading, placeBetError, user } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (user?.points - Number(amount) > 0) {
      await placeBet(gameId, Number(amount), team);
      setAmount("");
      toast.success("Bet placed")
      return;
    }
    toast.error("You don't have enough points to bet")

  };

  return (
    <form onSubmit={handleSubmit} className="mt-4" role="form">
      <div className="">
        <div className="flex gap-5">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Bet amount"
            className="flex-1 p-2 border rounded"
            min="1"
            required
          />
          <select
            value={team}
            onChange={(e) => setTeam(e.target.value as 'team1' | 'team2')}
            className="p-2 border rounded"
          >
            <option value="team1">Team 1</option>
            <option value="team2">Team 2</option>
          </select>
        </div>

        <div className="block mt-5">
          <button
            type="submit"
            disabled={isPlaceBetLoading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            Place Bet
          </button>
          {placeBetError && (
            <div className="mt-2 text-red-500 text-sm">{placeBetError}</div>
          )}
        </div>
      </div>

    </form>
  );
};
