import { createSlice } from "@reduxjs/toolkit";
import {
  createTeoExamThunk,
  createImgExamThunk,
  createUnifiedExamThunk,
  getExamsThunk,
  getExamByIdThunk,
  deleteExamThunk,
  getExamByUserIdThunk,
  getUserTeoExamsThunk,
  getUserImgExamsThunk,
  getUserUnifiedExamsThunk,
} from "../thunks/examThunk";

const initialState = {
  exams: [],
  exam: null,
  isLoading: false,
  error: null,
};

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //get exams
      .addCase(getExamsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getExamsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exams = action.payload;
      })
      .addCase(getExamsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      //get exam by id
      .addCase(getExamByIdThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getExamByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exam = action.payload;
      })
      .addCase(getExamByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      //create teo exam
      .addCase(createTeoExamThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTeoExamThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exams.push(action.payload);
      })
      .addCase(createTeoExamThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      //create img exam
      .addCase(createImgExamThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createImgExamThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exams.push(action.payload);
      })
      .addCase(createImgExamThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      //create unified exam
      .addCase(createUnifiedExamThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUnifiedExamThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exams.push(action.payload);
      })
      .addCase(createUnifiedExamThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      //delete exam
      .addCase(deleteExamThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteExamThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exams = state.exams.filter((exam) => exam.id !== action.payload);
      })
      .addCase(deleteExamThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      //get user exams
      .addCase(getExamByUserIdThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getExamByUserIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exams = action.payload;
      })
      .addCase(getExamByUserIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      //get user teo exams
      .addCase(getUserTeoExamsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserTeoExamsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exams = action.payload;
      })
      .addCase(getUserTeoExamsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      //get user img exams
      .addCase(getUserImgExamsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserImgExamsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exams = action.payload;
      })
      .addCase(getUserImgExamsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      //get user unified exams
      .addCase(getUserUnifiedExamsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserUnifiedExamsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exams = action.payload;
      })
      .addCase(getUserUnifiedExamsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default examSlice.reducer;
