import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { Game, User, Bet, LeaderboardEntry } from '../types/api';
import {FormErrorsProps} from "../types/error.ts";

interface Store {
  socket: Socket | null;
  user: User | null;
  games: Game[];
  bets: Bet[];
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  fetchBetError: string | null,
  isLoadingBets: boolean,
  isPlaceBetLoading: boolean,
  placeBetError: string | null
  error: string | null;
  formErrors: FormErrorsProps | null
  token: string | null;
  isLoadingAuth: boolean,
  authError: string | null,
  socketConnected: boolean;

  // Actions
  initializeSocket: () => void;
  setUser: (user: User | null) => void;
  setGames: (games: Game[]) => void;
  updateGame: (game: Game) => void;
  setBets: (bets: Bet[]) => void;
  addBet: (bet: Bet) => void;
  setLeaderboard: (leaderboard: LeaderboardEntry[]) => void;
  setError: (error: string | null) => void;
  cleanup: () => void;

  // API calls
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<void>;
  placeBet: (gameId: string, amount: number, team: 'team1' | 'team2') => Promise<Bet>;
  fetchBets: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

export const useStore = create<Store>((set, get) => ({
  socket: null,
  user: null,
  isLoadingAuth: false,
  authError: null,
  formErrors: null,
  games: [],
  bets: [],
  leaderboard: [],
  isLoading: false,
  error: null,
  fetchBetError: null,
  isLoadingBets: false,
  isPlaceBetLoading: false,
  placeBetError: null,
  token: null,
  socketConnected: false,

  initializeSocket: () => {
    if (get().socket?.connected) {
      return;
    }
    get().cleanup();
    const socket = io(BACKEND_URL, {
      auth: {
        token: get().token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      timeout: 20000,
    });

    // Function to set up all event listeners
    const setupEventListeners = () => {
      // Clear any existing listeners first
      socket.removeAllListeners();

      socket.on('connect', () => {
        console.log('Socket connected');
        set({ socketConnected: true });

        // Re-subscribe to channels on reconnection
        socket.emit('subscribe_games');
        socket.emit('subscribe_leaderboard');
      });

      socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        set({ socketConnected: false });
      });

      socket.on('gameData', ({ data }) => {
        if (Array.isArray(data)) {
          set({ games: data });
        } else {
          get().updateGame(data);
        }
      });

      socket.on('oddsUpdate', ({ data }) => {
        const games = get().games.map(game =>
          game.id === data.gameId
            ? { ...game, odds1: data.odds.team1, odds2: data.odds.team2 }
            : game
        );
        set({ games });
      });

      socket.on('leaderboardUpdate', (data) => {
        console.log('Received leaderboard update:', data); // Debug log
        set({ leaderboard: data.data });
      });

      // Add reconnect event handler
      socket.io.on('reconnect', () => {
        console.log('Socket reconnected - resubscribing to channels');
        socket.emit('subscribe_games');
        socket.emit('subscribe_leaderboard');
      });
    };

    setupEventListeners()

    set({ socket });
  },

  setUser: (user) => set({ user }),
  setGames: (games) => set({ games }),
  updateGame: (updatedGame) => {
    const games = get().games.map((game) =>
      game.id === updatedGame.id ? updatedGame : game
    );
    set({ games });
  },
  setBets: (bets) => set({ bets }),
  addBet: (bet) => set({ bets: [...get().bets, bet] }),
  setLeaderboard: (leaderboard) => set({ leaderboard }),
  setError: (error) => set({ error }),
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, isLoading: false });
      return;
    }
    set({ user: null, isLoading: true });
    try {
      const response = await fetch(`${BACKEND_URL}/api/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Invalid token');

      const { user } = await response.json();
      set({ user, isLoading: false });
    } catch (error) {
      console.error(error)
      set({ user: null, isLoading: false });
    }
  },
  login: async (email: string, password: string) => {
    try {
      set({ isLoadingAuth: true, authError: null });
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        const errorMessage = error.error || 'Login failed';
        set({authError: errorMessage})
        throw new Error(errorMessage);
      }

      const { token, user } = await response.json();
      set({ token})
      localStorage.setItem('token', token);
      set({ user });
      get().initializeSocket();
      get().fetchBets();
    } catch (error) {
      set({ authError: error instanceof Error ? error.message : 'Login failed' });
    } finally {
      set({ isLoadingAuth: false });
    }
  },
  register: async (username, email, password) => {
    try {
      set({ isLoadingAuth: true, authError: null });
      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          set({ formErrors: { errors: data.errors } });
          return;
        }
        set({ authError: data.error, formErrors: null })
      }

      const { token, user } = data;
      localStorage.setItem('token', token);
      set({ user });
      set({ token})
      get().initializeSocket();
      get().fetchBets();
    } catch (error) {
      set({ authError: error instanceof Error ? error.message : 'Registration failed' });
    } finally {
      set({ isLoadingAuth: false });
    }
  },

  placeBet: async (gameId: string, amount: number, team: 'team1' | 'team2') => {
    try {
      set({ isPlaceBetLoading: true, placeBetError: null });
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/api/bets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ gameId, amount, team })
      });

      if (!response.ok) {
        throw new Error('Failed to place bet');
      }

      const bet = await response.json();
      get().addBet(bet);

      // Update user points
      if (get().user) {
        set({
          user: {
            ...get().user!,
            points: get().user!.points - amount
          }
        });
      }
      get().fetchBets();
      return bet
    } catch (error) {
      set({ placeBetError: error instanceof Error ? error.message : 'Failed to place bet' });
    } finally {
      set({ isPlaceBetLoading: false });
    }
  },

  fetchBets: async () => {
    try {
      // Prevent multiple simultaneous fetches
      if (get().isLoadingBets) return;

      set({ isLoadingBets: true, fetchBetError: null });
      const token = localStorage.getItem('token');
      if (!token) {
        set({ isLoadingBets: false, fetchBetError: "Token not found." });
      }
      const response = await fetch(`${BACKEND_URL}/api/bets`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bets');
      }

      const bets = await response.json();
      set({ bets });
      get().initializeSocket();
    } catch (error) {
      set({ fetchBetError: error instanceof Error ? error.message : 'Failed to fetch bets' });
    } finally {
      set({ isLoadingBets: false });
    }
  },

  cleanup: () => {
    const { socket } = get();
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
    }
    set({ socket: null, socketConnected: false });
  },
  logout: () => {
    get().cleanup();
    set({ user: null});
    localStorage.removeItem('token')
  }
}));
