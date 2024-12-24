import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import {PrismaBetRepository} from "../repositories/betRepository";
import {BetService} from "../services/betService";
import {PrismaGameRepository} from "../repositories/gameRepository";
import {PrismaUserRepository} from "../repositories/userRepository";
import {prisma} from "../lib/prisma";
import {BetController} from "../controllers/betController";
import {AuthenticatedRequest} from "../types";
import {validate, validatePlaceBet} from "../middleware/validation";

const router = Router();
const betController = new BetController(
  new BetService(
    new PrismaBetRepository(prisma),
    new PrismaGameRepository(prisma),
    new PrismaUserRepository(prisma)
  )
);

router.post('/',
  authenticateToken,
  validatePlaceBet,
  validate,
  (req: Request, res: Response) => betController.placeBet(req as AuthenticatedRequest, res));
router.get('/', authenticateToken, (req, res) => betController.getUserBets(req as AuthenticatedRequest, res));

export default router;
