import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import {AuthResponse, ConflictError, LoginDTO, RegisterDTO, UnauthorizedError} from "../types/auth";
import {IUserRepository} from "../repositories/userRepository";

export interface IAuthService {
  register(userData: RegisterDTO): Promise<AuthResponse>;
  login(credentials: LoginDTO): Promise<AuthResponse>;
}

export class AuthService implements IAuthService {
  constructor(
    private userRepository: IUserRepository,
    private config: { jwtSecret: string }
  ) {}

  async register(userData: RegisterDTO): Promise<AuthResponse> {
    if (userData.email) {
      const existUser = await this.userRepository.findByEmail(userData.email)
      if (existUser) {
        throw new ConflictError('User with this email already exists');
      }
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await this.userRepository.create({
      username: userData.username,
      email: userData.email,
      password: hashedPassword
    });

    const token = this.generateToken(user.id);
    return { user, token };
  }

  async login(credentials: LoginDTO): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(credentials.email);

    if (!user || !await bcrypt.compare(credentials.password, user.password)) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = this.generateToken(user.id);
    return { user, token };
  }

  private generateToken(userId: number): string {
    return jwt.sign(
      { userId },
      this.config.jwtSecret,
      { expiresIn: '24h' }
    );
  }
}
