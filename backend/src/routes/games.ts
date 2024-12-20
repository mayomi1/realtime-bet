import { Router } from 'express';
import { prisma } from '../index';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const games = await prisma.game.findMany({
      where: { status: 'LIVE' }
    });
    res.json(games);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch games' });
  }
});

export default router;
