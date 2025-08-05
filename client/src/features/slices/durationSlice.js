import { createSlice } from "@reduxjs/toolkit";

const durationSlice = createSlice({
  name: "duration",
  initialState: {
    currentQuestionIndex: 0,
    defaultTimePerQuestion: 60,
    remainingTimes: {},
    questions: [], // sorular burada tutulur
  },
  reducers: {
    setQuestions: (state, action) => {
      state.questions = action.payload;
    },
    setCurrentQuestion: (state, action) => {
      state.currentQuestionIndex = action.payload;
    },
    setRemainingTime: (state, action) => {
      const { questionIndex, time } = action.payload;
      state.remainingTimes[questionIndex] = time;
    },
  },
});

export const { setQuestions, setCurrentQuestion, setRemainingTime } =
  durationSlice.actions;

export default durationSlice.reducer;
