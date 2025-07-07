import { createSlice } from "@reduxjs/toolkit";
import {
  createPracticeExamThunk,
  getPracticeExamThunk,
  updatePracticeExamThunk,
  getQuestionsPracticeExamThunk,
  deletePracticeExamThunk,
} from "../thunks/practiceExamThunk";
const initialState = {
  duration: 0,
  practiceExam: [],
  imgQuestions: [],
  isLoading: false,
  error: null,
};
const practiceExamSlice = createSlice({
  name: "practiceExam",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPracticeExamThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPracticeExamThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.practiceExam = action.payload;
      })
      .addCase(getPracticeExamThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(createPracticeExamThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPracticeExamThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.practiceExam.push(action.payload);
      })
      .addCase(createPracticeExamThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(updatePracticeExamThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePracticeExamThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.practiceExam.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.practiceExam[index] = action.payload;
        }
      })
      .addCase(updatePracticeExamThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getQuestionsPracticeExamThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getQuestionsPracticeExamThunk.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.imgQuestions = action.payload.questions;
        state.duration = action.payload.duration;
      })
      .addCase(getQuestionsPracticeExamThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(deletePracticeExamThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePracticeExamThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.practiceExam = state.practiceExam.filter(
          (item) => item.id !== action.payload.id
        );
      })
      .addCase(deletePracticeExamThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});
export default practiceExamSlice.reducer;
