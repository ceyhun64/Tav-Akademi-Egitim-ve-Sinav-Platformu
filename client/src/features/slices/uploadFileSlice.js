import { createSlice } from "@reduxjs/toolkit";
import {
  uploadFileThunk,
  uploadMultipleFilesThunk,
  getUploadedFilesByManagerThunk,
  getUploadedFilesByUserThunk,
  deleteUploadedFileThunk,
  updateDownloadedThunk,
  getDownloadedUserThunk,
} from "../thunks/uploadFileThunk";

const initialState = {
  uploadFiles: [],
  downloadUser: [],
  loading: false,
  error: null,
};

const uploadFileSlice = createSlice({
  name: "uploadFile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadFileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFileThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadFiles.push(action.payload); // Tekli dosya
      })
      .addCase(uploadFileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(uploadMultipleFilesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadMultipleFilesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadFiles = [...state.uploadFiles, ...action.payload]; // Çoklu dosya
      })
      .addCase(uploadMultipleFilesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getUploadedFilesByManagerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUploadedFilesByManagerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadFiles = action.payload; // Liste getirildi
      })
      .addCase(getUploadedFilesByManagerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getUploadedFilesByUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUploadedFilesByUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadFiles = action.payload; // Liste getirildi
      })
      .addCase(getUploadedFilesByUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteUploadedFileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUploadedFileThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadFiles = state.uploadFiles.filter(
          (file) => file.id !== action.payload
        );
      })
      .addCase(deleteUploadedFileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateDownloadedThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDownloadedThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.downloadUser = action.payload;
      })
      .addCase(updateDownloadedThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getDownloadedUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDownloadedUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.downloadUser = action.payload;
      })
      .addCase(getDownloadedUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default uploadFileSlice.reducer;
