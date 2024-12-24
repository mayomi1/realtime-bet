import {BetRequestDTO, NotFoundError} from "../types";
import {Bet} from "@prisma/client";
import {IBetRepository} from "../repositories/betRepository";
import {IGameRepository} from "../repositories/gameRepository";
import {IUserRepository} from "../repositories/userRepository";

export interface IBetService {
  placeBet(userId: number, betData: BetRequestDTO): Promise<Bet>;
  getUserBets(userId: number): Promise<Bet[]>;
}

export class BetService implements IBetService {
  constructor(
    private betRepository: IBetRepository,
    private gameRepository: IGameRepository,
    private userRepository: IUserRepository
  ) {}

  /**
   * Places a bet for a user on a specific game.
   *
   * @param userId - The unique identifier of the user placing the bet.
   * @param betData - The details of the bet, including the game ID, amount, and team.
   * @returns A promise that resolves to the created bet object.
   * @throws NotFoundError - If the game with the provided ID is not found.
   */
  async placeBet(userId: number, betData: BetRequestDTO): Promise<Bet> {
    const game = await this.gameRepository.findById(betData.gameId);
    if (!game) {
      throw new NotFoundError('Game not found');
    }

    const odds = betData.team === 'team1' ? game.odds1 : game.odds2;

    const bet = await this.betRepository.create({
      userId,
      gameId: betData.gameId,
      amount: betData.amount,
      odds,
      team: betData.team
    });

    await this.userRepository.updatePoints(userId, betData.amount);

    return bet;
  }

  async getUserBets(userId: number): Promise<Bet[]> {
    return this.betRepository.findByUserId(userId);
  }
}
