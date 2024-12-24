import { Router } from 'express';
import {GameController} from "../controllers/gameController";
import {GameService} from "../services/gameService";
import {PrismaGameRepository} from "../repositories/gameRepository";
import {prisma} from "../lib/prisma";

const router = Router();
const gameController = new GameController(
  new GameService(
    new PrismaGameRepository(prisma)
  )
);

router.get('/', (req, res) => gameController.getLiveGames(req, res));

export default router;
