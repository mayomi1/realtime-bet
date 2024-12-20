import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "../features/gameSlice";
import leaderboardReducer from "../features/leaderboardSlice";

export const store = configureStore({
  reducer: {
    game: gameReducer,
    leaderboard: leaderboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
