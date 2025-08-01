import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getIllegalMoves,
  addIllegalMoves,
  deleteIllegalMoves,
} from "../services/illegalMovesService";

export const getIllegalMovesThunk = createAsyncThunk(
  "illegalMoves/getIllegalMoves",
  async () => {
    try {
      const response = await getIllegalMoves();
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const addIllegalMovesThunk = createAsyncThunk(
  "illegalMoves/addIllegalMoves",
  async (data) => {
    try {
      const response = await addIllegalMoves(data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteIllegalMovesThunk = createAsyncThunk(
  "illegalMoves/deleteIllegalMoves",
  async (id) => {
    try {
      const response = await deleteIllegalMoves(id);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);
