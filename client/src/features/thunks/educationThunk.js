import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllEducations,
  getEducationById,
  getEducationByEducationSetId,
  uploadSingleFile,
  addPageDuration,
  getPageDuration,
  uploadMultipleFiles,
  deleteEducation,
  updateEducation,
  updateEducationUser,
  getCompletedEducations
} from "../services/educationService";

export const getAllEducationsThunk = createAsyncThunk(
  "education/getAllEducations",
  async (_, thunkAPI) => {
    try {
      const response = await getAllEducations();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getEducationByIdThunk = createAsyncThunk(
  "education/getEducationById",
  async (id, thunkAPI) => {
    try {
      const response = await getEducationById(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getEducationByEducationSetIdThunk = createAsyncThunk(
  "education/getEducationByEducationSetId",
  async (id, thunkAPI) => {
    try {
      const response = await getEducationByEducationSetId(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const uploadSingleThunk = createAsyncThunk(
  "education/uploadSingle",
  async (formData, thunkAPI) => {
    try {
      const response = await uploadSingleFile(formData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const addPageDurationThunk = createAsyncThunk(
  "education/addPageDuration",
  async ({ id, pages }, thunkAPI) => {
    try {
      const response = await addPageDuration(id, pages);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getPageDurationThunk = createAsyncThunk(
  "education/getPageDuration",
  async (id, thunkAPI) => {
    try {
      const response = await getPageDuration(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const uploadMultiplesThunk = createAsyncThunk(
  "education/uploadMultiples",
  async (formData, thunkAPI) => {
    try {
      const response = await uploadMultipleFiles(formData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const deleteEducationThunk = createAsyncThunk(
  "education/deleteEducation",
  async (id, thunkAPI) => {
    try {
      const response = await deleteEducation(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const updateEducationThunk = createAsyncThunk(
  "education/updateEducation",
  async ({ id, formData }, thunkAPI) => {
    try {
      const response = await updateEducation(id, formData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const updateEducationUserThunk = createAsyncThunk(
  "educationset/updateEducationUser",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await updateEducationUser(id, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getCompletedEducationsThunk = createAsyncThunk(
  "education/getCompletedEducations",
  async (_, thunkAPI) => {
    try {
      const response = await getCompletedEducations();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);