import { createSlice } from "@reduxjs/toolkit";
import {
  getAllGalleriesThunk,
  getGalleryByIdThunk,
  getGalleryByCategoryThunk,
  getGalleryBySubCategoryThunk,
  uploadSingleImageThunk,
  uploadMultipleImagesThunk,
  deleteGalleryThunk,
  updateGalleryThunk,
} from "../thunks/imageGalleryThunk";

const initialState = {
  galleries: [],
  gallery: null,
  isLoading: false,
  error: null,
};

const imageGallerySlice = createSlice({
  name: "imageGallery",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllGalleriesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllGalleriesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.galleries = action.payload;
      })
      .addCase(getAllGalleriesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getGalleryByIdThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getGalleryByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.gallery = action.payload;
      })
      .addCase(getGalleryByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(getGalleryByCategoryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getGalleryByCategoryThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.galleries = action.payload;
      })
      .addCase(getGalleryByCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getGalleryBySubCategoryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getGalleryBySubCategoryThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.galleries = action.payload;
      })
      .addCase(getGalleryBySubCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(uploadSingleImageThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadSingleImageThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.galleries = [...state.galleries, action.payload];
      })

      .addCase(uploadSingleImageThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(uploadMultipleImagesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadMultipleImagesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.galleries = [...state.galleries, ...action.payload]; // payload dizi ise
      })
      .addCase(uploadMultipleImagesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteGalleryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteGalleryThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedId = action.payload;
        state.galleries = state.galleries.filter(
          (item) => item.id !== deletedId
        );
      })
      .addCase(deleteGalleryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateGalleryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateGalleryThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.galleries = state.galleries.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(updateGalleryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default imageGallerySlice.reducer;
