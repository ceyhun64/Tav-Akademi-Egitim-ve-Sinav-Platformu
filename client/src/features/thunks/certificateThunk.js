import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCompletedEducationSets,
  createCertificate,
  getCertificates,
  getCourseNos,
  getCourseTypes,
  getEducators,
  getRequesters,
  createCourseNo,
  createCourseType,
  createEducator,
  createRequester,
  deleteCourseNo,
  deleteCourseType,
  deleteEducator,
  deleteRequester,
} from "../services/certificateService";

export const getCompletedEducationSetsThunk = createAsyncThunk(
  "certificate/getCompletedEducationSets",
  async (educationSetId, thunkAPI) => {
    try {
      const response = await getCompletedEducationSets(educationSetId);
      console.log("thunk:", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const createCertificateThunk = createAsyncThunk(
  "certificate/createCertificate",
  async (data, thunkAPI) => {
    try {
      const response = await createCertificate(data);
      console.log("thunk:", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getCertificatesThunk = createAsyncThunk(
  "certificate/getCertificates",
  async (_, thunkAPI) => {
    try {
      const response = await getCertificates();
      console.log("thunk:", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getCourseNosThunk = createAsyncThunk(
  "certificate/getCourseNos",
  async (_, thunkAPI) => {
    try {
      const response = await getCourseNos();
      console.log("thunk:", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getCourseTypesThunk = createAsyncThunk(
  "certificate/getCourseTypes",
  async (_, thunkAPI) => {
    try {
      const response = await getCourseTypes();
      console.log("thunk:", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getEducatorsThunk = createAsyncThunk(
  "certificate/getEducators",
  async (_, thunkAPI) => {
    try {
      const response = await getEducators();
      console.log("thunk:", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getRequestersThunk = createAsyncThunk(
  "certificate/getRequesters",
  async (_, thunkAPI) => {
    try {
      const response = await getRequesters();
      console.log("thunk:", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const createCourseNoThunk = createAsyncThunk(
  "certificate/createCourseNo",
  async (data, thunkAPI) => {
    try {
      const response = await createCourseNo(data);
      console.log("thunk:", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const createCourseTypeThunk = createAsyncThunk(
  "certificate/createCourseType",
  async (data, thunkAPI) => {
    try {
      const response = await createCourseType(data);
      console.log("thunk:", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const createEducatorThunk = createAsyncThunk(
  "certificate/createEducator",
  async (data, thunkAPI) => {
    try {
      const response = await createEducator(data);
      console.log("thunk:", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const createRequesterThunk = createAsyncThunk(
  "certificate/createRequester",
  async (data, thunkAPI) => {
    try {
      const response = await createRequester(data);
      console.log("thunk:", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const deleteCourseNoThunk = createAsyncThunk(
  "certificate/deleteCourseNo",
  async (id, thunkAPI) => {
    try {
      const response = await deleteCourseNo(id);
      console.log("thunk:", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const deleteCourseTypeThunk = createAsyncThunk(
  "certificate/deleteCourseType",
  async (id, thunkAPI) => {
    try {
      const response = await deleteCourseType(id);
      console.log("thunk:", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const deleteEducatorThunk = createAsyncThunk(
  "certificate/deleteEducator",
  async (id, thunkAPI) => {
    try {
      const response = await deleteEducator(id);
      console.log("thunk:", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const deleteRequesterThunk = createAsyncThunk(
  "certificate/deleteRequester",
  async (id, thunkAPI) => {
    try {
      const response = await deleteRequester(id);
      console.log("thunk:", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
