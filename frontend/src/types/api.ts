export interface User {
  id: string;
  username: string;
  email: string;
  points: number;
}

export interface Game {
  id: string;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  odds1: number;
  odds2: number;
  timeRemaining: string;
  status: 'PENDING' | 'LIVE' | 'FINISHED';
}

export interface Bet {
  id: string;
  userId: string;
  gameId: string;
  amount: number;
  odds: number;
  team: 'team1' | 'team2';
  status: 'PENDING' | 'WON' | 'LOST';
  game: Game;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  points: number;
}
