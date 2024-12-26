import {Request, Response, Router} from "express";
import {AuthController} from "../controllers/authController";
import {AuthService} from "../services/authService";
import {PrismaUserRepository} from "../repositories/userRepository";
import {prisma} from "../lib/prisma";

const router = Router();
const userController = new AuthController(
  new AuthService(
    new PrismaUserRepository(prisma),
    { jwtSecret: process.env.JWT_SECRET! }
  )
);

router.get('/me', (req: Request, res: Response) => userController.me(req, res))

export default router;
