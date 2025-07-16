import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllUserTeoResults,
  getAllUserImgResults,
  getUserResultDetail,
  getUserEducationResultDetail,
  getAllUserEducationSetsResult,
  deleteUserExamResult,
  deleteUserEducationResult,
  getQuestionCategoryResult,
  getImgQuestionResult,
  getTeoQuestionResult,
  getUserImgExamResult,
  getUserTeoExamResult,
  getAssignImgExams,
  getAssignTeoExams,
  getAssignEducationSets,
  deleteAssignEducationSet,
  deleteAssignExam,
} from "../services/reportService";

export const getUserTeoResultsThunk = createAsyncThunk(
  "report/getUserTeoResults",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllUserTeoResults();
      console.log("thunk:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUserImgResultsThunk = createAsyncThunk(
  "report/getUserImgResults",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllUserImgResults();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUserResultDetailThunk = createAsyncThunk(
  "report/getUserTeoResult",
  async ({ userId, examId }, { rejectWithValue }) => {
    try {
      const response = await getUserResultDetail(userId, examId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUserEducationResultDetailThunk = createAsyncThunk(
  "report/getUserEducationResultDetail",
  async ({ userId, educationSetId }, { rejectWithValue }) => {
    try {
      const response = await getUserEducationResultDetail(
        userId,
        educationSetId
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllUserEducationSetsResultThunk = createAsyncThunk(
  "report/getAllUserEducationSetsResult",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllUserEducationSetsResult();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteUserExamResultThunk = createAsyncThunk(
  "report/deleteUserExamResult",
  async ({ userExamIds }, { rejectWithValue }) => {
    try {
      const response = await deleteUserExamResult(userExamIds);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteUserEducationResultThunk = createAsyncThunk(
  "report/deleteUserEducationResult",
  async ({ userEducationIds }, { rejectWithValue }) => {
    try {
      const response = await deleteUserEducationResult(userEducationIds);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getQuestionCategoryResultThunk = createAsyncThunk(
  "report/getQuestionCategoryResult",
  async ({ userId, examId }, { rejectWithValue }) => {
    try {
      const response = await getQuestionCategoryResult(userId, examId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getImgQuestionResultThunk = createAsyncThunk(
  "report/getImgQuestionResult",
  async ({ userId, examId }, { rejectWithValue }) => {
    try {
      const response = await getImgQuestionResult(userId, examId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getTeoQuestionResultThunk = createAsyncThunk(
  "report/getTeoQuestionResult",
  async ({ userId, examId }, { rejectWithValue }) => {
    try {
      const response = await getTeoQuestionResult(userId, examId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getUserImgExamResultThunk = createAsyncThunk(
  "report/getUserImgExamResult",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserImgExamResult();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getUserTeoExamResultThunk = createAsyncThunk(
  "report/getUserTeoExamResult",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserTeoExamResult();
      console.log("thunk:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getAssignImgExamsThunk = createAsyncThunk(
  "report/getAssignImgExams",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAssignImgExams();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getAssignTeoExamsThunk = createAsyncThunk(
  "report/getAssignTeoExams",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAssignTeoExams();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteAssignExamThunk = createAsyncThunk(
  "report/deleteAssignExam",
  async (examId, { rejectWithValue }) => {
    try {
      console.log("thunk examId:", examId);
      const response = await deleteAssignExam(examId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getAssignEducationSetsThunk = createAsyncThunk(
  "report/getAssignEducationSets",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAssignEducationSets();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteAssignEducationSetThunk = createAsyncThunk(
  "report/deleteAssignEducationSet",
  async (educationSetId, { rejectWithValue }) => {
    try {
      const response = await deleteAssignEducationSet(educationSetId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
