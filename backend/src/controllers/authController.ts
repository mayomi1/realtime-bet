import {IAuthService} from "../services/authService";
import {ConflictError, LoginDTO, RegisterDTO, UnauthorizedError} from "../types/auth";

import {Request, Response} from "express"

export class AuthController {
  constructor(private authService: IAuthService) {
  }

  async register(req: Request<{}, {}, RegisterDTO>, res: Response) {
    try {
      const result = await this.authService.register(req.body);
      res.json(result);
    } catch (error) {
      console.error("Error during registration:", error);
      if (error instanceof ConflictError) {
        res.status(409).json({error: error.message});
      } else {
        res.status(400).json({error: 'Registration failed'});
      }
    }
  }

  async login(req: Request<{}, {}, LoginDTO>, res: Response) {
    try {
      const {user, token} = await this.authService.login(req.body);
      const result = {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          points: user.points
        },
        token: token
      }
      res.json(result);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        res.status(401).json({error: error.message});
      } else {
        res.status(400).json({error: 'Login failed'});
      }
    }
  }

  async me(req: Request, res: Response) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({error: 'Unauthorized'});
      return;
    }

    try {
      const result = await this.authService.me(token);
      res.json(result);
    } catch (error) {
      console.error("Error during me request:", error);
      res.status(500).json({error: 'Internal Server Error'});
    }
  }
}
