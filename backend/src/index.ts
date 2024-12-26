import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import * as dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import betRoutes from './routes/betRoutes';
import gameRoutes from './routes/gameRoutes';
import userRoutes from './routes/userRoutes';
import { setupSocketHandlers } from './socket';
import router from "./routes/userRoutes";

dotenv.config();

export const app = express();
const httpServer = createServer(app);
const origin = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://realtime-bet.vercel.app'
];

const io = new Server(httpServer, {
  cors: {
    origin,
    methods: ['GET', 'POST']
  }
});

app.use(cors({
  origin,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/games', gameRoutes);
app.use('/api', userRoutes)

// Socket.IO setup
setupSocketHandlers(io);

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
