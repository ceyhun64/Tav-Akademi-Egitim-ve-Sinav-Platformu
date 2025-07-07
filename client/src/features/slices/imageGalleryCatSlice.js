import { createSlice } from "@reduxjs/toolkit";
import {
  getImageGalleryCategoryThunk,
  getImageGallerySubCategoryThunk,
  getImageGallerySubCategoryByCategoryThunk,
  createImageGalleryCategoryThunk,
  createImageGallerySubCategoryThunk,
  deleteImageGalleryCategoryThunk,
  deleteImageGallerySubCategoryThunk,
  updateImageGalleryCategoryThunk,
  updateImageGallerySubCategoryThunk,
} from "../thunks/imageGalleryCatThunk";

const initialState = {
  imageGalleryCategory: [],
  imageGallerySubCategory: [],
  isLoading: false,
  isError: false,
  error: "",
};

const imageGalleryCatSlice = createSlice({
  name: "imageGalleryCat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET CATEGORY
      .addCase(getImageGalleryCategoryThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getImageGalleryCategoryThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.imageGalleryCategory = action.payload;
      })
      .addCase(getImageGalleryCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })

      // GET SUBCATEGORY
      .addCase(getImageGallerySubCategoryThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getImageGallerySubCategoryThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.imageGallerySubCategory = action.payload;
      })
      .addCase(getImageGallerySubCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })

      // GET SUBCATEGORY BY CATEGORY
      .addCase(getImageGallerySubCategoryByCategoryThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getImageGallerySubCategoryByCategoryThunk.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.imageGallerySubCategory = action.payload;
        }
      )
      .addCase(
        getImageGallerySubCategoryByCategoryThunk.rejected,
        (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.error = action.payload;
        }
      )

      // CREATE CATEGORY
      .addCase(createImageGalleryCategoryThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createImageGalleryCategoryThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.imageGalleryCategory.push(action.payload);
      })
      .addCase(createImageGalleryCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })

      // CREATE SUBCATEGORY
      .addCase(createImageGallerySubCategoryThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        createImageGallerySubCategoryThunk.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.imageGallerySubCategory.push(action.payload);
        }
      )
      .addCase(createImageGallerySubCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })

      // DELETE CATEGORY
      .addCase(deleteImageGalleryCategoryThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteImageGalleryCategoryThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.imageGalleryCategory = state.imageGalleryCategory.filter(
          (cat) => cat.id !== action.payload.id
        );
      })
      .addCase(deleteImageGalleryCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })

      // DELETE SUBCATEGORY
      .addCase(deleteImageGallerySubCategoryThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        deleteImageGallerySubCategoryThunk.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.imageGallerySubCategory = state.imageGallerySubCategory.filter(
            (cat) => cat.id !== action.payload.id
          );
        }
      )
      .addCase(deleteImageGallerySubCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })

      // UPDATE CATEGORY
      .addCase(updateImageGalleryCategoryThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateImageGalleryCategoryThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.imageGalleryCategory = state.imageGalleryCategory.map((cat) =>
          cat.id === action.payload.id ? action.payload : cat
        );
      })
      .addCase(updateImageGalleryCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })

      // UPDATE SUBCATEGORY
      .addCase(updateImageGallerySubCategoryThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        updateImageGallerySubCategoryThunk.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.imageGallerySubCategory = state.imageGallerySubCategory.map(
            (cat) => (cat.id === action.payload.id ? action.payload : cat)
          );
        }
      )
      .addCase(updateImageGallerySubCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      });
  },
});

export default imageGalleryCatSlice.reducer;
