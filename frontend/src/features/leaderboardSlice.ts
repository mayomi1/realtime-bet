import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface User {
  name: string;
  score: number;
}

interface LeaderboardState {
  leaderboard: User[];
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: LeaderboardState = {
  leaderboard: [],
  status: "idle",
  error: null,
};

// Async thunk for fetching leaderboard data
export const fetchLeaderboard = createAsyncThunk<User[]>(
  "leaderboard/fetchLeaderboard",
  async () => {
    const response = await fetch("/api/leaderboard"); // Replace with your API URL
    if (!response.ok) {
      throw new Error("Failed to fetch leaderboard");
    }
    return response.json();
  }
);

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState,
  reducers: {
    setLeaderboard: (state, action: PayloadAction<User[]>) => {
      state.leaderboard = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.status = "idle";
        state.leaderboard = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const { setLeaderboard } = leaderboardSlice.actions;

export default leaderboardSlice.reducer;
