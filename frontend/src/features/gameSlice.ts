import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Game = {
  id: string;
  team1: string;
  team2: string;
  score: string;
  remainingTime: string;
  odds: { team1: number; team2: number };
};

interface GameState {
  games: Game[];
}

const initialState: GameState = {
  games: [],
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGames(state, action: PayloadAction<Game[]>) {
      state.games = action.payload;
    },
    updateGame(state, action: PayloadAction<Game>) {
      const index = state.games.findIndex((g) => g.id === action.payload.id);
      if (index !== -1) state.games[index] = action.payload;
    },
  },
});

export const { setGames, updateGame } = gameSlice.actions;
export default gameSlice.reducer;
