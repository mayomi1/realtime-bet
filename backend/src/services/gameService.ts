import {IGameRepository} from "../repositories/gameRepository";
import {Game} from "@prisma/client";

export interface IGameService {
  getLiveGames(): Promise<Game[]>;
}

export class GameService implements IGameService {
  constructor(private gameRepository: IGameRepository) {}

  async getLiveGames(): Promise<Game[]> {
    return this.gameRepository.findLiveGames();
  }
}
