import { Server, Socket } from 'socket.io';
import { prisma } from './lib/prisma';

interface SocketData {
  userId?: string;
  subscribedToGames: boolean;
  subscribedToLeaderboard: boolean;
}

export const socketHandlers = {
  broadcastLeaderboard: async () => {
    // This will be replaced when socket is initialized
    console.warn('Socket handlers not initialized');
  }
};

export const setupSocketHandlers = (io: Server) => {
  const broadcastLeaderboard = async () => {
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

    const formattedLeaderboard = leaderboard.map((user) => ({
      userId: user.id,
      userName: user.username,
      points: user.points
    }));

    io.emit('leaderboardUpdate', {
      type: 'leaderboardUpdate',
      data: formattedLeaderboard
    });
  };
  // Store the reference to broadcastLeaderboard
  socketHandlers.broadcastLeaderboard = broadcastLeaderboard;


  io.on('connection', async (socket: Socket) => {
    // Initialize socket data
    const socketData: SocketData = {
      subscribedToGames: false,
      subscribedToLeaderboard: false
    };

    socket.on('subscribe_games', async () => {
      // console.log('Client subscribed to games:', socket.id);
      socketData.subscribedToGames = true;
      socket.join('games');


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
      socket.join('leaderboard');

      await broadcastLeaderboard();
    });

    socket.on('disconnect', () => {
      socketData.subscribedToGames = false;
      socketData.subscribedToLeaderboard = false;
      socket.leave('games');
      socket.leave('leaderboard');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });
};
