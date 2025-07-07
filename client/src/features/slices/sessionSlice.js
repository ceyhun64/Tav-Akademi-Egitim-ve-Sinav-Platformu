import { createSlice } from "@reduxjs/toolkit";
import {
  getSessionsThunk,
  deactivateSessionThunk,
  activateSessionThunk,
} from "../thunks/sessionThunk";

const initialState = {
  sessions: [],
  isLoading: false,
  error: null,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    // getSessionsThunk
      .addCase(getSessionsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSessionsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions = action.payload;
      })
      .addCase(getSessionsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // deactivateSessionThunk
      .addCase(deactivateSessionThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deactivateSessionThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions = state.sessions.map((session) =>
          session.id === action.payload.id ? action.payload : session
        );
      })
      .addCase(deactivateSessionThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // activateSessionThunk
      .addCase(activateSessionThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(activateSessionThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions = state.sessions.map((session) =>
          session.id === action.payload.id ? action.payload : session
        );
      })
      .addCase(activateSessionThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});
export default sessionSlice.reducer;
