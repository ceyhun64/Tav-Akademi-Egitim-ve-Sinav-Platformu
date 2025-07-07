import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getPracticeExam,
  createPracticeExam,
  updatePracticeExam,
  getQuestionsPracticeExam,
  deletePracticeExam,
} from "../services/practiceExamService";

export const getPracticeExamThunk = createAsyncThunk(
  "practiceExam/getPracticeExam",
  async () => {
    try {
      const response = await getPracticeExam();
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
export const createPracticeExamThunk = createAsyncThunk(
  "practiceExam/createPracticeExam",
  async (data) => {
    try {
      const response = await createPracticeExam(data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
export const updatePracticeExamThunk = createAsyncThunk(
  "practiceExam/updatePracticeExam",
  async ({ id, duration, question_count }) => {
    try {
      const response = await updatePracticeExam(id, {
        duration,
        question_count,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const getQuestionsPracticeExamThunk = createAsyncThunk(
  "practiceExam/getQuestionsPracticeExam",
  async (examId) => {
    try {
      const response = await getQuestionsPracticeExam(examId);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
export const deletePracticeExamThunk = createAsyncThunk(
  "practiceExam/deletePracticeExam",
  async (id) => {
    try {
      const response = await deletePracticeExam(id);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
