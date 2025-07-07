import { createSlice } from "@reduxjs/toolkit";
import {
  createPoolImgThunk,
  deletePoolImgThunk,
  getPoolImgByIdThunk,
  getPoolImgThunk,
  updatePoolImgThunk,
  getPoolImgsByBookletIdThunk,
} from "../thunks/poolImgThunk";

const initialState = {
  poolImgs: [],
  poolImg: null,
  loading: false,
  error: null,
};

const poolImgSlice = createSlice({
  name: "poolImg",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPoolImgThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPoolImgThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.poolImgs = action.payload;
      })
      .addCase(getPoolImgThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPoolImgByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPoolImgByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.poolImg = action.payload;
      })
      .addCase(getPoolImgByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPoolImgThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPoolImgThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.poolImgs.push(action.payload);
      })
      .addCase(createPoolImgThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePoolImgThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePoolImgThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.poolImgs.findIndex(
          (poolImg) => poolImg.id === action.payload.id
        );
        if (index !== -1) {
          state.poolImgs[index] = action.payload;
        }
        state.poolImg = action.payload;
      })

      .addCase(updatePoolImgThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePoolImgThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePoolImgThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.poolImgs = state.poolImgs.filter(
          (poolImg) => poolImg.id !== action.payload.id
        );
      })
      .addCase(deletePoolImgThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPoolImgsByBookletIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPoolImgsByBookletIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.poolImgs = action.payload;
      })
      .addCase(getPoolImgsByBookletIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default poolImgSlice.reducer;
