import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createBanSubs,
  deleteBanSubs,
  getBanSubs,
  updateBanSubs,
} from "../services/banSubsService";

export const getBanSubsThunk = createAsyncThunk(
  "banSub/getBanSubs",
  async (_, thunkAPI) => {
    try {
      const response = await getBanSubs();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const createBanSubsThunk = createAsyncThunk(
  "banSub/createBanSubs",
  async ({ name }, thunkAPI) => {
    try {
      const response = await createBanSubs({ name });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const updateBanSubsThunk = createAsyncThunk(
  "banSub/updateBanSubs",
  async ({ id, name }, thunkAPI) => {
    try {
      const response = await updateBanSubs({ id, name });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const deleteBanSubsThunk = createAsyncThunk(
  "banSub/deleteBanSubs",
  async (id, thunkAPI) => {
    try {
      const response = await deleteBanSubs(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
