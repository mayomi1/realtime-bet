import { Request } from "express"

export interface BetRequestDTO {
  gameId: number;
  amount: number;
  team: 'team1' | 'team2';
}

export interface BetCreateDTO {
  userId: number;
  gameId: number;
  amount: number;
  odds: number;
  team: string;
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
  }
}

export interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
  };
}
