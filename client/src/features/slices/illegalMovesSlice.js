import { createSlice } from "@reduxjs/toolkit";
import {
  getIllegalMovesThunk,
  addIllegalMovesThunk,
  deleteIllegalMovesThunk,
} from "../thunks/illegalMovesThunk";

const initialState = {
  illegalMoves: [],
  isLoading: false,
  error: null,
};

const illegalMovesSlice = createSlice({
  name: "illegalMove",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIllegalMovesThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getIllegalMovesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.illegalMoves = action.payload;
      })
      .addCase(getIllegalMovesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addIllegalMovesThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addIllegalMovesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.illegalMoves.push(action.payload);
      })
      .addCase(addIllegalMovesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteIllegalMovesThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteIllegalMovesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.illegalMoves = state.illegalMoves.filter(
          (illegalMove) => illegalMove.id !== action.payload
        );
      });
  },
});

export default illegalMovesSlice.reducer;
