import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  get_teo_questions,
  get_img_questions,
  get_both_questions_teo,
  get_both_questions_img,
  answer_teo_questions,
  answer_img_questions,
} from "../services/questionService";

//teorik soruları getir
export const getTeoQuestionsThunk = createAsyncThunk(
  "question/getTeoQuestions",
  async (examId, thunkAPI) => {
    try {
      const response = await get_teo_questions(examId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
//görsel soruları getir
export const getImgQuestionsThunk = createAsyncThunk(
  "question/getImgQuestions",
  async (examId, thunkAPI) => {
    try {
      const response = await get_img_questions(examId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
//birleşik soruları getir(teorik)
export const getBothQuestionsTeoThunk = createAsyncThunk(
  "question/getBothQuestionsTeo",
  async (examId, thunkAPI) => {
    try {
      const response = await get_both_questions_teo(examId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
//birleşik soruları getir(görsel)
export const getBothQuestionsImgThunk = createAsyncThunk(
  "question/getBothQuestionsImg",
  async (examId, thunkAPI) => {
    try {
      const response = await get_both_questions_img(examId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
//teorik soruları cevapla
export const answerTeoQuestionsThunk = createAsyncThunk(
  "question/answerTeoQuestions",
  async (
    { answers, examId, entry_date, entry_time, exit_date, exit_time },
    thunkAPI
  ) => {
    try {
      const response = await answer_teo_questions(
        answers,
        examId,
        entry_date,
        entry_time,
        exit_date,
        exit_time
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
//görsel soruları cevapla
export const answerImgQuestionsThunk = createAsyncThunk(
  "question/answerImgQuestions",
  async (
    { answers, examId, entry_date, entry_time, exit_date, exit_time },
    thunkAPI
  ) => {
    try {
      const response = await answer_img_questions(
        answers,
        examId,
        entry_date,
        entry_time,
        exit_date,
        exit_time
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
