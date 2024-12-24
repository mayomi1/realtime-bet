import {PrismaClient, User} from "@prisma/client";
import {UserCreateDTO} from "../types/auth";

export interface IUserRepository {
  updatePoints(userId: number, amount: number): Promise<void>;
  create(userData: UserCreateDTO): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}

export class PrismaUserRepository implements IUserRepository {
  private prisma: PrismaClient
  constructor(private prismaClient: PrismaClient) {
    this.prisma = prismaClient
  }

  async create(userData: UserCreateDTO): Promise<User> {
    return this.prisma?.user.create({
      data: userData
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email }
    });
  }

  async updatePoints(userId: number, amount: number): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { points: { decrement: amount } }
    });
  }
}
