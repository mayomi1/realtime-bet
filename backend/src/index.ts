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
const origin = [ process.env.FRONTEND_URL || 'http://localhost:5173', 'https://363a-2c0f-f5c0-b04-17fa-51fb-326a-63ec-df6b.ngrok-free.app' ];

const io = new Server(httpServer, {
  cors: {
    origin,
    methods: ['GET', 'POST']
  }
});

export const prisma = new PrismaClient();

app.use(cors({
  origin,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/games', gameRoutes);

// Socket.IO setup
setupSocketHandlers(io);

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
