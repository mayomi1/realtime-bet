import { Request, Response } from "express";

import {IGameService} from "../services/gameService";

export class GameController {
  constructor(private gameService: IGameService) {}

  async getLiveGames(req: Request, res: Response) {
    try {
      const games = await this.gameService.getLiveGames();
      res.json(games);
    } catch (error) {
      res.status(400).json({ error: 'Failed to fetch games' });
    }
  }
}
