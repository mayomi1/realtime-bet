import { Response } from "express"
import {IBetService} from "../services/betService";
import {AuthenticatedRequest, NotFoundError} from "../types";

export class BetController {
  constructor(private betService: IBetService) {}

  async placeBet(req: AuthenticatedRequest, res: Response) {
    try {
      const { gameId, amount, team } = req.body;
      const userId = req.user.userId;

      const bet = await this.betService.placeBet(userId, { gameId, amount, team });
      res.json(bet);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'Failed to place bet' });
      }
    }
  }

  async getUserBets(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user.userId;
      const bets = await this.betService.getUserBets(userId);
      res.json(bets);
    } catch (error) {
      res.status(400).json({ error: 'Failed to fetch bets' });
    }
  }
}
