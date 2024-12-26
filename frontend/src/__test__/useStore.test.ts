// store/useStore.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useStore } from '../store/useStore';
import { io } from 'socket.io-client';

vi.mock('socket.io-client');

describe('useStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    useStore.setState({ socket: null, user: null, games: [], bets: [], token: null });
  });

  describe('auth actions', () => {
    it('should handle login successfully', async () => {
      const mockUser = { id: '1', email: 'test@test.com' };
      const mockToken = 'test-token';

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ user: mockUser, token: mockToken })
      });

      await useStore.getState().login('test@test.com', 'password');

      expect(useStore.getState().user).toEqual(mockUser);
      expect(localStorage.getItem('token')).toBe(mockToken);
    });

    it('should handle login failure', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Invalid credentials' })
      });

      await useStore.getState().login('test@test.com', 'wrong-password');

      expect(useStore.getState().user).toBeNull();
      expect(useStore.getState().authError).toBe('Invalid credentials');
    });

    it('should handle logout', () => {
      useStore.setState({ user: { id: 1, email: 'test@test.com', points: 1000, username: 'test' }, token: 'test-token' });
      localStorage.setItem('token', 'test-token');

      useStore.getState().logout();

      expect(useStore.getState().user).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('bet actions', () => {
    const mockToken = 'test-token';
    const mockBet = { id: 1, amount: 100, gameId: 1, team: 'team1' };

    beforeEach(() => {
      localStorage.setItem('token', mockToken);
    });

    it('should place bet successfully', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockBet)
      });

      await useStore.getState().placeBet('1', 100, 'team1');

      expect(useStore.getState().bets).toContainEqual(mockBet);
      expect(useStore.getState().placeBetError).toBeNull();
    });

    it('should fetch bets successfully', async () => {
      const mockBets = [mockBet];
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockBets)
      });

      await useStore.getState().fetchBets();

      expect(useStore.getState().bets).toEqual(mockBets);
    });
  });

  describe('socket management', () => {
    const mockSocket = {
      on: vi.fn(),
      emit: vi.fn(),
      disconnect: vi.fn(),
    };

    beforeEach(() => {
      (io as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockSocket);
    });

    it('should initialize socket connection', () => {
      useStore.getState().initializeSocket();

      expect(mockSocket.on).toHaveBeenCalledWith('connect', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('gameData', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('oddsUpdate', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('leaderboardUpdate', expect.any(Function));
    });

    it('should update game data on socket event', () => {
      const mockGame = { id: '1', team1: 'Team A', team2: 'Team B' };
      useStore.getState().initializeSocket();

      // @ts-ignore
      const gameDataHandler = mockSocket.on.mock.calls.find(
        call => call && call[0] === 'gameData'
      )[1];
      gameDataHandler({ data: [mockGame] });

      expect(useStore.getState().games).toEqual([mockGame]);
    });

    it('should cleanup socket and intervals', () => {
      useStore.getState().initializeSocket();
      useStore.getState().cleanup();

      expect(mockSocket.disconnect).toHaveBeenCalled();
    });
  });
});
