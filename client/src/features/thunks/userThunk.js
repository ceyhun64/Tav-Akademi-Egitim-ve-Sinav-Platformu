import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getUserDetails,
  updateUserDetails,
  getAllUsers,
  deleteUsers,
  aktifPasifUser,
} from "../services/userService";

export const getUserDetailsThunk = createAsyncThunk(
  "user/getUserDetails",
  async (id, thunkAPI) => {
    try {
      const response = await getUserDetails(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getAllUsersThunk = createAsyncThunk(
  "user/getAllUsers",
  async () => {
    try {
      const response = await getAllUsers();
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const updateUserDetailsThunk = createAsyncThunk(
  "user/updateUserDetails",
  async (id, formData) => {
    try {
      const response = await updateUserDetails(id, formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteUsersThunk = createAsyncThunk(
  "user/deleteUsers",
  async (userIds, thunkAPI) => {
    try {
      const response = await deleteUsers(userIds);
      console.log("response thunk :", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const aktifPasifUserThunk = createAsyncThunk(
  "user/aktifPasifUser",
  async ({ userIds, durum }, thunkAPI) => {
    try {
      const response = await aktifPasifUser(userIds, durum);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
