import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createQuestionCat,
  createDifLevel,
  deleteQuestionCat,
  deleteDifLevel,
  getQuestionCat,
  getDifLevels,
} from "../services/queDifService";

export const getQuestionCatThunk = createAsyncThunk(
  "queDif/getQuestionCat",
  async (_, thunkAPI) => {
    try {
      const response = await getQuestionCat();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const createQuestionCatThunk = createAsyncThunk(
  "queDif/createQuestionCat",
  async (name, thunkAPI) => {
    try {
      const response = await createQuestionCat(name);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const deleteQuestionCatThunk = createAsyncThunk(
  "queDif/deleteQuestionCat",
  async (id, thunkAPI) => {
    try {
      const response = await deleteQuestionCat(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getDifLevelsThunk = createAsyncThunk(
  "queDif/getDifLevels",
  async (_, thunkAPI) => {
    try {
      const response = await getDifLevels();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const createDifLevelThunk = createAsyncThunk(
  "queDif/createDifLevel",
  async (name, thunkAPI) => {
    try {
      const response = await createDifLevel(name);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const deleteDifLevelThunk = createAsyncThunk(
  "queDif/deleteDifLevel",
  async (id, thunkAPI) => {
    try {
      const response = await deleteDifLevel(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
