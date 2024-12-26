import { Router, Request, Response } from 'express';
import {AuthController} from "../controllers/authController";
import {AuthService} from "../services/authService";
import {PrismaUserRepository} from "../repositories/userRepository";
import { prisma } from '../lib/prisma';
import {validate, validateLogin, validateRegistration} from "../middleware/validation";

const router = Router();
const authController = new AuthController(
  new AuthService(
    new PrismaUserRepository(prisma),
    { jwtSecret: process.env.JWT_SECRET! }
  )
);

router.post('/register',
  validateRegistration,
  validate,
  (req: Request, res: Response) => authController.register(req, res));

router.post('/login',
  validateLogin,
  validate,
  (req: Request, res: Response) => authController.login(req, res));

router.get('/me', (req: Request, res: Response) => authController.me(req, res))

export default router;
