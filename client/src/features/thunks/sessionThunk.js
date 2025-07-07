import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getSessions,
  deactivateSession,
  activateSession,
} from "../services/sessionService";

export const getSessionsThunk = createAsyncThunk(
  "session/getSessions",
  async (_, thunkAPI) => {
    try {
      const response = await getSessions();
      console.log("response:", response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deactivateSessionThunk = createAsyncThunk(
  "session/deactivateSession",
  async (sessionId, thunkAPI) => {
    try {
      const response = await deactivateSession(sessionId);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const activateSessionThunk = createAsyncThunk(
  "session/activateSession",
  async (sessionId, thunkAPI) => {
    try {
      const response = await activateSession(sessionId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
