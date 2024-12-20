import { useEffect } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { setGames, updateGame } from "../features/gameSlice";
import { setLeaderboard } from "../features/leaderboardSlice";

const useWebSocket = (url: string) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io(url);

    socket.on("gameData", (games) => {
      dispatch(setGames(games));
    });

    socket.on("updateGame", (game) => {
      dispatch(updateGame(game));
    });

    socket.on("leaderboard", (leaderboard) => {
      dispatch(setLeaderboard(leaderboard));
    });

    return () => {
      socket.disconnect();
    };
  }, [url, dispatch]);
};

export default useWebSocket;
