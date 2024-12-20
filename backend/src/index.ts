import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import * as dotenv from 'dotenv';
import authRoutes from './routes/auth';
import betRoutes from './routes/bets';
import gameRoutes from './routes/games';
import { setupSocketHandlers } from './socket';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

export const prisma = new PrismaClient();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/games', gameRoutes);

// Socket.IO setup
setupSocketHandlers(io);

const PORT = process.env.PORT || 3002;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
