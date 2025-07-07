import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getExams,
  getExamById,
  createTeoExam,
  createImgExam,
  createUnifiedExam,
  deleteExam,
  getExamByUserId,
  getUserTeoExams,
  getUserImgExams,
  getUserUnifiedExams,
} from "../services/examService";
export const getExamsThunk = createAsyncThunk(
  "exam/getExams",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getExams();
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getExamByIdThunk = createAsyncThunk(
  "exam/getExamById",
  async (examId, { rejectWithValue }) => {
    try {
      const res = await getExamById(examId);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const createTeoExamThunk = createAsyncThunk(
  "exam/createTeoExam",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await createTeoExam(formData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const createImgExamThunk = createAsyncThunk(
  "exam/createImgExam",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await createImgExam(formData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const createUnifiedExamThunk = createAsyncThunk(
  "exam/createUnifiedExam",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await createUnifiedExam(formData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteExamThunk = createAsyncThunk(
  "exam/deleteExam",
  async (examId, { rejectWithValue }) => {
    try {
      const res = await deleteExam(examId);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getExamByUserIdThunk = createAsyncThunk(
  "exam/getExamByUserId",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getExamByUserId();
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getUserTeoExamsThunk = createAsyncThunk(
  "exam/getUserTeoExams",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserTeoExams();
      console.log(res);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getUserImgExamsThunk = createAsyncThunk(
  "exam/getUserImgExams",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserImgExams();
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getUserUnifiedExamsThunk = createAsyncThunk(
  "exam/getUserUnifiedExams",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserUnifiedExams();
      console.log("thunk res.data", res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
