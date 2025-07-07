import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getPoolTeos,
  getPoolTeoById,
  createPoolTeo,
  updatePoolTeo,
  deletePoolTeo,
  getPoolTeosByBookletId,
  uploadQuestionsFromExcel,
} from "../services/poolTeoService";

export const getPoolTeosThunk = createAsyncThunk(
  "poolTeo/getAll",
  async (_, thunkAPI) => {
    try {
      const response = await getPoolTeos();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getPoolTeoByIdThunk = createAsyncThunk(
  "poolTeo/getById",
  async (id, thunkAPI) => {
    try {
      const response = await getPoolTeoById(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const createPoolTeoThunk = createAsyncThunk(
  "poolTeo/create",
  async (formData, thunkAPI) => {
    try {
      const response = await createPoolTeo(formData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const uploadQuestionsFromExcelThunk = createAsyncThunk(
  "poolTeo/uploadQuestionsFromExcel",
  async (formData, thunkAPI) => {
    try {
      const response = await uploadQuestionsFromExcel(formData);
      console.log("thunk:", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updatePoolTeoThunk = createAsyncThunk(
  "poolTeo/update",
  async ({ id, formData }, thunkAPI) => {
    try {
      const response = await updatePoolTeo(id, formData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deletePoolTeoThunk = createAsyncThunk(
  "poolTeo/delete",
  async (id, thunkAPI) => {
    try {
      await deletePoolTeo(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getPoolTeosByBookletIdThunk = createAsyncThunk(
  "poolTeo/getByBookletId",
  async (bookletId, thunkAPI) => {
    try {
      const response = await getPoolTeosByBookletId(bookletId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
