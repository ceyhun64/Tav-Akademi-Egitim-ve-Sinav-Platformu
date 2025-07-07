import { createSlice } from "@reduxjs/toolkit";
import {
  getBothQuestionsImgThunk,
  getBothQuestionsTeoThunk,
  getImgQuestionsThunk,
  getTeoQuestionsThunk,
  answerImgQuestionsThunk,
  answerTeoQuestionsThunk,
} from "../thunks/questionThunk";

const initialState = {
  questions: [],
  teoQuestions: [],
  imgQuestions: [],
  bothTeoQuestions: [],
  bothImgQuestions: [],
  duration: 0,
  name: "", // Added to store the exam name
  otherExamId: null,
  fetchStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  answerStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  isError: false,
  error: null,
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH: Teorik sorular
      .addCase(getTeoQuestionsThunk.pending, (state) => {
        state.fetchStatus = "loading";
        state.isError = false;
        state.error = null;
      })
      .addCase(getTeoQuestionsThunk.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.teoQuestions = action.payload.questions;
        state.duration = action.payload.duration;
        state.name = action.payload.name; // Store the exam name
      })
      .addCase(getTeoQuestionsThunk.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.isError = true;
        state.error = action.payload;
      })

      // FETCH: Görsel sorular
      .addCase(getImgQuestionsThunk.pending, (state) => {
        state.fetchStatus = "loading";
        state.isError = false;
        state.error = null;
      })
      .addCase(getImgQuestionsThunk.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.imgQuestions = action.payload.questions;
        state.duration = action.payload.duration;
        state.name = action.payload.name; // Store the exam name
      })
      .addCase(getImgQuestionsThunk.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.isError = true;
        state.error = action.payload;
      })

      // FETCH: Birleşik sorular (Teorik)
      .addCase(getBothQuestionsTeoThunk.pending, (state) => {
        state.fetchStatus = "loading";
        state.isError = false;
        state.error = null;
      })
      .addCase(getBothQuestionsTeoThunk.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.bothTeoQuestions = action.payload.questions;
        state.duration = action.payload.duration;
        state.otherExamId = action.payload.otherExamId;
        state.name = action.payload.name; // Store the exam name
      })
      .addCase(getBothQuestionsTeoThunk.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.isError = true;
        state.error = action.payload;
      })

      // FETCH: Birleşik sorular (Görsel)
      .addCase(getBothQuestionsImgThunk.pending, (state) => {
        state.fetchStatus = "loading";
        state.isError = false;
        state.error = null;
      })
      .addCase(getBothQuestionsImgThunk.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.bothImgQuestions = action.payload.questions;
        state.duration = action.payload.duration;
        state.name = action.payload.name; // Store the exam name
      })
      .addCase(getBothQuestionsImgThunk.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.isError = true;
        state.error = action.payload;
      })

      // ANSWER: Teorik soruları cevapla
      .addCase(answerTeoQuestionsThunk.pending, (state) => {
        state.answerStatus = "loading";
        state.isError = false;
        state.error = null;
      })
      .addCase(answerTeoQuestionsThunk.fulfilled, (state, action) => {
        state.answerStatus = "succeeded";
        state.questions = action.payload.questions;
        state.duration = action.payload.duration;
      })
      .addCase(answerTeoQuestionsThunk.rejected, (state, action) => {
        state.answerStatus = "failed";
        state.isError = true;
        state.error = action.payload;
      })

      // ANSWER: Görsel soruları cevapla
      .addCase(answerImgQuestionsThunk.pending, (state) => {
        state.answerStatus = "loading";
        state.isError = false;
        state.error = null;
      })
      .addCase(answerImgQuestionsThunk.fulfilled, (state, action) => {
        state.answerStatus = "succeeded";
        state.questions = action.payload.questions;
        state.duration = action.payload.duration;
      })
      .addCase(answerImgQuestionsThunk.rejected, (state, action) => {
        state.answerStatus = "failed";
        state.isError = true;
        state.error = action.payload;
      });
  },
});

export default questionSlice.reducer;
