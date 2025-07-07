import { createSlice } from "@reduxjs/toolkit";
import {
  getCompletedEducationSetsThunk,
  createCertificateThunk,
  getCertificatesThunk,
} from "../thunks/certificateThunk";

const initialState = {
  completedEducationSets: [],
  certificates: [],
  loading: false,
  error: null,
};
const certificateSlice = createSlice({
  name: "certificate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCompletedEducationSetsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompletedEducationSetsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.completedEducationSets = action.payload;
      })
      .addCase(getCompletedEducationSetsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCertificateThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCertificateThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Eğer action.payload yeni dizi ise direkt ata
        state.completedEducationSets = action.payload;
      })

      .addCase(createCertificateThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCertificatesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCertificatesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.certificates = action.payload;
      })
      .addCase(getCertificatesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export default certificateSlice.reducer;
