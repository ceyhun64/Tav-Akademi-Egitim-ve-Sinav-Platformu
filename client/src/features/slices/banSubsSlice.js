import { createSlice } from "@reduxjs/toolkit";
import {
  createBanSubsThunk,
  deleteBanSubsThunk,
  getBanSubsThunk,
  updateBanSubsThunk,
} from "../thunks/banSubsThunk";
const initialState = {
  banSubs: [],
  isLoading: false,
  error: null,
};

const banSubsSlice = createSlice({
  name: "banSubs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBanSubsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBanSubsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.banSubs = action.payload;
      })
      .addCase(getBanSubsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createBanSubsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBanSubsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.banSubs.push(action.payload);
      })
      .addCase(createBanSubsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateBanSubsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBanSubsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.banSubs.findIndex(
          (banSub) => banSub.id === action.payload.id
        );
        if (index !== -1) {
          state.banSubs[index] = action.payload;
        }
      })
      .addCase(updateBanSubsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteBanSubsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBanSubsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.banSubs = state.banSubs.filter(
          (banSub) => banSub.id !== action.payload.id
        );
      })
      .addCase(deleteBanSubsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default banSubsSlice.reducer;
