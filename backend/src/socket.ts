import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { prisma } from './lib/prisma';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

interface DecodedToken {
  userId: number;
  // Add other token payload fields as needed
}

interface AuthenticatedSocket extends Socket {
  userId?: number;
  subscribedToGames: boolean;
  subscribedToLeaderboard: boolean;
}

interface SocketData {
  userId?: number;
  subscribedToGames: boolean;
  subscribedToLeaderboard: boolean;
}

const authenticateSocket = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>,
  next: (err?: Error) => void
) => {
  const token = socket.handshake.auth.token || socket.handshake.headers['authorization'];

  if (!token) {
    return next(new Error('Authentication token missing'));
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    // Initialize socket data
    socket.data.userId = decoded.userId;
    socket.data.subscribedToGames = false;
    socket.data.subscribedToLeaderboard = false;

    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
};

export const setupSocketHandlers = (io: Server) => {
  io.use(authenticateSocket);

  io.on('connection', async (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>) => {
    // Initialize socket data

    console.log('Client connected:', socket.id, 'User:', socket.data.userId);

    try {
      const user = await prisma.user.findUnique({
        where: { id: socket.data.userId }
      });

      if (!user) {
        socket.disconnect();
        return;
      }
    } catch (error) {
      console.error('Error verifying user:', error);
      socket.disconnect();
      return;
    }

    socket.on('subscribe_games', async () => {
      socket.data.subscribedToGames = true;

      try {
        // Send initial games data
        const games = await prisma.game.findMany({
          where: {
            status: {
              in: ['LIVE']
            }
          }
        });

        socket.emit('gameData', {
          type: 'gameData',
          data: games
        });
      } catch (error) {
        console.error('Error fetching games:', error);
        socket.emit('error', { message: 'Failed to fetch games data' });
      }
    });

    socket.on('subscribe_leaderboard', async () => {
      socket.data.subscribedToLeaderboard = true;

      try {
        const leaderboard = await prisma.user.findMany({
          select: {
            id: true,
            username: true,
            points: true
          },
          orderBy: {
            points: 'desc'
          },
          take: 10
        });

        socket.emit('leaderboardUpdate', {
          type: 'leaderboardUpdate',
          data: leaderboard.map((user) => ({
            userId: user.id,
            userName: user.username,
            points: user.points
          }))
        });
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        socket.emit('error', { message: 'Failed to fetch leaderboard data' });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id, 'User:', socket.data.userId);
      socket.data.subscribedToGames = false;
      socket.data.subscribedToLeaderboard = false;

      // Check if there are any remaining subscribers
      const hasSubscribers = Array.from(io.sockets.sockets.values()).some(
        (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>) =>
          socket.data.subscribedToGames
      );
    });
  });
};

// Helper function to update game time (mm:ss format)
function updateGameTime(currentTime: string): string {
  const [minutes, seconds] = currentTime.split(':').map(Number);

  let newSeconds = seconds - 15; // Decrease by 15 seconds each update
  let newMinutes = minutes;

  if (newSeconds < 0) {
    newSeconds = 45;
    newMinutes--;
  }

  if (newMinutes < 0) {
    return '00:00';
  }

  // Format with leading zeros
  const formattedMinutes = newMinutes.toString().padStart(2, '0');
  const formattedSeconds = newSeconds.toString().padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}
