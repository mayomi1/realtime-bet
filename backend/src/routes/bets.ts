import { Router } from 'express';
import { prisma } from '../index';
import { authenticateToken } from '../middleware/auth';

const router = Router();


// @ts-ignore
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { gameId, amount, team } = req.body;
    if (!req.user) {
      res.status(401).json({ error: 'Unauthenticated request' });
    }
    // @ts-ignore
    const userId = req.user.userId;

    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const odds = team === 'team1' ? game.odds1 : game.odds2;

    const bet = await prisma.bet.create({
      data: {
        userId,
        gameId,
        amount,
        odds,
        team,
      }
    });

    // Update user points
    await prisma.user.update({
      where: { id: userId },
      data: { points: { decrement: amount } }
    });

    res.json(bet);
  } catch (error) {
    res.status(400).json({ error: 'Failed to place bet' });
  }
});


// @ts-ignore
router.get('/', authenticateToken,  async (req, res) => {
  try {
    const userId = req.user?.userId;
    const bets = await prisma.bet.findMany({
      where: { userId },
      orderBy: { id: "desc"},
      include: { game: true }
    });
    res.json(bets);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch bets' });
  }
});

export default router;
