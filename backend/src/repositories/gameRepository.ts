import {Game, PrismaClient} from "@prisma/client";

export interface IGameRepository {
  findById(id: number): Promise<Game | null>;
  findLiveGames(): Promise<Game[]>;
}

export class PrismaGameRepository implements IGameRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: number): Promise<Game | null> {
    return this.prisma.game.findUnique({
      where: { id }
    });
  }

  async findLiveGames(): Promise<Game[]> {
    return this.prisma.game.findMany({
      where: { status: 'LIVE' }
    });
  }
}
