import { createSlice } from "@reduxjs/toolkit";
import { getLogActivityThunk } from "../thunks/logActivityThunk";
const initialState = {
  logActivity: [],
  loading: false,
  error: null,
};
const logActivitySlice = createSlice({
  name: "logActivity",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLogActivityThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLogActivityThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.logActivity = action.payload;
      })
      .addCase(getLogActivityThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default logActivitySlice.reducer;
