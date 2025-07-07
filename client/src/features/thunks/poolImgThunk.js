import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createPoolImg,
  deletePoolImg,
  getPoolImgById,
  getPoolImgs,
  updatePoolImg,
  getPoolImgsByBookletId,
} from "../services/poolImgService";

export const getPoolImgThunk = createAsyncThunk(
  "poolImg/getAll",
  async (_, thunkAPI) => {
    try {
      const response = await getPoolImgs();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getPoolImgByIdThunk = createAsyncThunk(
  "poolImg/getById",
  async (id, thunkAPI) => {
    try {
      const response = await getPoolImgById(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const createPoolImgThunk = createAsyncThunk(
  "poolImg/create",
  async (formData, thunkAPI) => {
    try {
      const response = await createPoolImg(formData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const updatePoolImgThunk = createAsyncThunk(
  "poolImg/update",
  async ({ id, formData }, thunkAPI) => {
    try {
      console.log("thunk formData:", formData);
      console.log("thunk id:", id);
      const response = await updatePoolImg(id, formData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const deletePoolImgThunk = createAsyncThunk(
  "poolImg/delete",
  async (id, thunkAPI) => {
    try {
      const response = await deletePoolImg(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getPoolImgsByBookletIdThunk = createAsyncThunk(
  "poolImg/getByBookletId",
  async (bookletId, thunkAPI) => {
    try {
      const response = await getPoolImgsByBookletId(bookletId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
