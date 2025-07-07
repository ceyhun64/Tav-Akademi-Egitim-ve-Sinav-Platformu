import { createAsyncThunk } from "@reduxjs/toolkit";
import { getLogActivity } from "../services/logActivitiyService";

export const getLogActivityThunk = createAsyncThunk(
  "logActivity/getLogActivity",
  async () => {
    try {
      const response = await getLogActivity();
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);
