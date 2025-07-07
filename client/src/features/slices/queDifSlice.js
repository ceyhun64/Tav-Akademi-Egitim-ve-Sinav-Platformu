import { createSlice } from "@reduxjs/toolkit";
import {
  createQuestionCatThunk,
  deleteQuestionCatThunk,
  getQuestionCatThunk,
  getDifLevelsThunk,
  createDifLevelThunk,
  deleteDifLevelThunk,
} from "../thunks/queDifThunk";

const initialState = {
  questionCats: [],
  difLevels: [],
  isLoading: false,
  isError: false,
  error: "",
};

const queDifSlice = createSlice({
  name: "queDif",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getQuestionCatThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getQuestionCatThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.questionCats = action.payload;
      })
      .addCase(getQuestionCatThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      .addCase(createQuestionCatThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createQuestionCatThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.questionCats.push(action.payload);
      })
      .addCase(createQuestionCatThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      .addCase(deleteQuestionCatThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteQuestionCatThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.questionCats = state.questionCats.filter(
          (cat) => cat.id !== action.payload.id
        );
      })
      .addCase(deleteQuestionCatThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      .addCase(getDifLevelsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDifLevelsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.difLevels = action.payload;
      })
      .addCase(getDifLevelsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      .addCase(createDifLevelThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createDifLevelThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.difLevels.push(action.payload);
      })
      .addCase(createDifLevelThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      .addCase(deleteDifLevelThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteDifLevelThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.difLevels = state.difLevels.filter(
          (dif) => dif.id !== action.payload.id
        );
      })
      .addCase(deleteDifLevelThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      });
  },
});

export default queDifSlice.reducer;
