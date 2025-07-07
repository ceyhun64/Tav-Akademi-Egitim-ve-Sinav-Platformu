// features/thunks/EducationCatThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllEducationSets,
  assignUsersToEducationSet,
  getEducationSetById,
  getEducationSetsUser,
  createEducationSet,
  deleteEducationSet,
  updateEducationSet,
  updateEducationSetUser,
  getCompletedEducationSets,
} from "../services/educationSetService";

export const getEducationSetsThunk = createAsyncThunk(
  "educationset/getEducationSets",
  async (_, thunkAPI) => {
    try {
      const response = await getAllEducationSets();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getEducationSetByIdThunk = createAsyncThunk(
  "educationset/getEducationSetById",
  async (id, thunkAPI) => {
    try {
      const response = await getEducationSetById(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getEducationSetsUserThunk = createAsyncThunk(
  "educationset/getEducationSetsUser",
  async (_, thunkAPI) => {
    try {
      const response = await getEducationSetsUser();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const createEducationSetThunk = createAsyncThunk(
  "educationset/createEducationSet",
  async (data, thunkAPI) => {
    try {
      const response = await createEducationSet(data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const assignUsersToEducationSetThunk = createAsyncThunk(
  "educationset/assignUsersToEducationSet",
  async (data, thunkAPI) => {
    try {
      const response = await assignUsersToEducationSet(data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const deleteEducationSetThunk = createAsyncThunk(
  "educationset/deleteEducationSet",
  async (id, thunkAPI) => {
    try {
      const response = await deleteEducationSet(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const updateEducationSetThunk = createAsyncThunk(
  "educationset/updateEducationSet",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await updateEducationSet(id, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const updateEducationSetUserThunk = createAsyncThunk(
  "educationset/updateEducationSetUser",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await updateEducationSetUser(id, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Beklenmeyen bir hata oluştu."
      );
    }
  }
);

export const getCompletedEducationSetsThunk = createAsyncThunk(
  "educationset/getCompletedEducationSets",
  async (_, thunkAPI) => {
    try {
      const response = await getCompletedEducationSets();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
