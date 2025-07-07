import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getBooklets,
  getBookletByType,
  getBookletById,
  createBooklet,
  updateBooklet,
  deleteBooklet,
  getTeoBooklets,
  getImgBooklets,
} from "../services/bookletService";

export const getBookletsThunk = createAsyncThunk(
  "booklet/getBooklets",
  async (_, thunkAPI) => {
    try {
      const response = await getBooklets();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getTeoBookletsThunk = createAsyncThunk(
  "booklet/getTeoBooklets",
  async (_, thunkAPI) => {
    try {
      const response = await getTeoBooklets();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getImgBookletsThunk = createAsyncThunk(
  "booklet/getImgBooklets",
  async (_, thunkAPI) => {
    try {
      const response = await getImgBooklets();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getBookletByTypeThunk = createAsyncThunk(
  "booklet/getBookletByType",
  async (type, thunkAPI) => {
    try {
      const response = await getBookletByType(type);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getBookletByIdThunk = createAsyncThunk(
  "booklet/getBookletById",
  async (id, thunkAPI) => {
    try {
      const response = await getBookletById(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const createBookletThunk = createAsyncThunk(
  "booklet/createBooklet",
  async ({ name, type }, thunkAPI) => {
    try {
      const response = await createBooklet({ name, type }); // formData = {name, type}
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateBookletThunk = createAsyncThunk(
  "booklet/updateBooklet",
  async ({ id, name }, thunkAPI) => {
    try {
      const response = await updateBooklet(id, name);
      console.log("thunk:", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteBookletThunk = createAsyncThunk(
  "booklet/deleteBooklet",
  async (id, thunkAPI) => {
    try {
      const response = await deleteBooklet(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
