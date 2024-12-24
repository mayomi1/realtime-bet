import request from 'supertest';
import { app } from '../index';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';

import { AuthService } from '../services/authService';
import { mockUserRepository } from '../__mocks__/repositories';
import {IUserRepository} from "../repositories/userRepository";

describe('Auth Service', () => {
  let authService: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService(mockUserRepository as unknown as IUserRepository, { jwtSecret: 'test_secret' });
  });

  describe('register', () => {
    const registerData = {
      email: 'test@example.com',
      password: 'password123',
      username: 'testuser'
    };

    it('should register new user successfully', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue({
        id: '1',
        ...registerData,
        password: 'hashedPassword'
      });

      const result = await authService.register(registerData);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(mockUserRepository.create).toHaveBeenCalled();
    });

    it('should throw if user exists', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({ id: '1' });

      await expect(authService.register(registerData))
        .rejects
        .toThrow('User with this email already exists');
    });
  });
});
