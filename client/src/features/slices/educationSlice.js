import { createSlice } from "@reduxjs/toolkit";
import {
  getAllEducationsThunk,
  getEducationByIdThunk,
  getEducationByEducationSetIdThunk,
  uploadSingleThunk,
  addPageDurationThunk,
  getPageDurationThunk,
  uploadMultiplesThunk,
  deleteEducationThunk,
  updateEducationThunk,
  updateEducationUserThunk,
  getCompletedEducationsThunk,
} from "../thunks/educationThunk";

const initialState = {
  educations: [],
  pageDurations: [],
  pages: [],
  completedEducations: [],
  education: null,
  isLoading: false,
  error: null,
};

const educationSlice = createSlice({
  name: "education",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllEducationsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllEducationsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.educations = action.payload;
      })
      .addCase(getAllEducationsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getEducationByIdThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getEducationByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.education = action.payload;
      })
      .addCase(getEducationByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(getEducationByEducationSetIdThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getEducationByEducationSetIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.educations = action.payload;
      })
      .addCase(getEducationByEducationSetIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(uploadSingleThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadSingleThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.educations.push(action.payload.newEducation); // varsayım: nesne döner
      })
      .addCase(uploadSingleThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addPageDurationThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addPageDurationThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pages = action.payload; // Gelen sayfa sürelerini pages state'ine ata
      })
      .addCase(addPageDurationThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getPageDurationThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPageDurationThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pageDurations = action.payload; // Gelen sayfa sürelerini pageDurations state'ine ata
      })
      .addCase(getPageDurationThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(uploadMultiplesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadMultiplesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.educations = [...state.educations, ...action.payload]; // payload dizi ise
      })
      .addCase(uploadMultiplesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteEducationThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteEducationThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedId = action.payload;
        state.educations = state.educations.filter(
          (item) => item.id !== deletedId
        );
      })
      .addCase(deleteEducationThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateEducationThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateEducationThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        // Listeyi güncelle
        state.educations = state.educations.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
        // Detay sayfasını da güncelle (isteğe bağlı)
        state.education = action.payload;
      })

      .addCase(updateEducationThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // UPDATE EDUCATION USER
      .addCase(updateEducationUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Önceki hataları temizle
      })
      .addCase(updateEducationUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.completedEducations = state.completedEducations.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(updateEducationUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default educationSlice.reducer;
