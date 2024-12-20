import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.bet.deleteMany();
  await prisma.game.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: 'john_doe',
        email: 'john@example.com',
        password: hashedPassword,
        points: 1000
      }
    }),
    prisma.user.create({
      data: {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: hashedPassword,
        points: 1500
      }
    }),
    prisma.user.create({
      data: {
        username: 'bob_wilson',
        email: 'bob@example.com',
        password: hashedPassword,
        points: 2000
      }
    }),
    prisma.user.create({
      data: {
        username: 'alice_johnson',
        email: 'alice@example.com',
        password: hashedPassword,
        points: 750
      }
    })
  ]);

  // Create games
  const games = await Promise.all([
    prisma.game.create({
      data: {
        team1: 'Man2',
        team2: 'Warriors',
        score1: 2,
        score2: 3,
        odds1: 1.95,
        odds2: 1.85,
        timeRemaining: '45min',
        status: 'LIVE'
      }
    }),
    prisma.game.create({
      data: {
        team1: 'Arsenal',
        team2: 'Man City',
        score1: 1,
        score2: 3,
        odds1: 2.10,
        odds2: 1.75,
        timeRemaining: '45min',
        status: 'LIVE'
      }
    }),
    prisma.game.create({
      data: {
        team1: 'Italy',
        team2: 'Spain',
        score1: 0,
        score2: 0,
        odds1: 1.65,
        odds2: 2.25,
        timeRemaining: '30min',
        status: 'PENDING'
      }
    }),
    prisma.game.create({
      data: {
        team1: 'Suns',
        team2: 'Moons',
        score1: 2,
        score2: 1,
        odds1: 1.90,
        odds2: 1.90,
        timeRemaining: '00min',
        status: 'FINISHED'
      }
    })
  ]);

  // Create some sample bets
  const bets = await Promise.all([
    prisma.bet.create({
      data: {
        userId: users[0].id,
        gameId: games[0].id,
        amount: 100,
        odds: 1.95,
        team: 'team1',
        status: 'PENDING'
      }
    }),
    prisma.bet.create({
      data: {
        userId: users[1].id,
        gameId: games[0].id,
        amount: 150,
        odds: 1.85,
        team: 'team2',
        status: 'PENDING'
      }
    }),
    prisma.bet.create({
      data: {
        userId: users[2].id,
        gameId: games[1].id,
        amount: 200,
        odds: 2.10,
        team: 'team1',
        status: 'PENDING'
      }
    }),
    prisma.bet.create({
      data: {
        userId: users[0].id,
        gameId: games[3].id,
        amount: 100,
        odds: 1.90,
        team: 'team1',
        status: 'WON'
      }
    })
  ]);

  console.log({
    users: users.length,
    games: games.length,
    bets: bets.length
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
