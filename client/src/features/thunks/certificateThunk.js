import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCompletedEducationSets ,createCertificate,getCertificates} from "../services/certificateService";

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
