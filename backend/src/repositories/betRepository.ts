import {BetCreateDTO} from "../types";
import {Bet, PrismaClient} from "@prisma/client";

export interface IBetRepository {
  create(bet: BetCreateDTO): Promise<Bet>;
  findByUserId(userId: number): Promise<Bet[]>;
}


export class PrismaBetRepository implements IBetRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Creates a new bet in the database.
   *
   * @param bet - The data transfer object containing the details of the bet to be created.
   * @returns A promise that resolves to the created Bet object.
   */
  async create(bet: BetCreateDTO): Promise<Bet> {
    return this.prisma.bet.create({
      data: bet
    });
  }

  /**
   * Retrieves a list of bets made by a specific user from the database.
   *
   * @param userId - The unique identifier of the user whose bets are to be retrieved.
   * @returns A promise that resolves to an array of Bet objects. The array is sorted in descending order by the bet's ID.
   * Each Bet object includes the related Game object.
   */
  async findByUserId(userId: number): Promise<Bet[]> {
    return this.prisma.bet.findMany({
      where: { userId },
      orderBy: { id: "desc" },
      include: { game: true }
    });
  }
}
