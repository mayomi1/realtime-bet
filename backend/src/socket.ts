import { Server, Socket } from 'socket.io';
import { prisma } from './index';

interface SocketData {
  userId?: string;
  subscribedToGames: boolean;
  subscribedToLeaderboard: boolean;
}

export const setupSocketHandlers = (io: Server) => {
  io.on('connection', async (socket: Socket) => {
    // Initialize socket data
    const socketData: SocketData = {
      subscribedToGames: false,
      subscribedToLeaderboard: false
    };

    console.log('Client connected:', socket.id);

    socket.on('subscribe_games', async () => {
      // console.log('Client subscribed to games:', socket.id);
      socketData.subscribedToGames = true;

      // Send initial games data
      const games = await prisma.game.findMany({
        where: {
          status: {
            in: ['PENDING', 'LIVE']
          }
        }
      });

      socket.emit('gameData', {
        type: 'gameData',
        data: games
      });
    });

    socket.on('subscribe_leaderboard', async () => {
      // console.log('Client subscribed to leaderboard:', socket.id);
      socketData.subscribedToLeaderboard = true;

      // Send initial leaderboard data
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
        data: leaderboard.map((user: any) => ({
          userId: user.id,
          userName: user.username,
          points: user.points
        }))
      });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      socketData.subscribedToGames = false;
      socketData.subscribedToLeaderboard = false;

      // Check if there are any remaining subscribers
      const hasSubscribers = Array.from(io.sockets.sockets.values()).some(
        socket => (socket.data as SocketData).subscribedToGames
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

  console.log('<>>>>>>>>>>>>update time')
  return `${formattedMinutes}:${formattedSeconds}`;
}
