// features/thunks/imageGalleryCatThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getImageGalleryCategory,
  getImageGallerySubCategory,
  getImageGallerySubCategoryByCategory,
  createImageGalleryCategory,
  createImageGallerySubCategory,
  deleteImageGalleryCategory,
  deleteImageGallerySubCategory,
  updateImageGalleryCategory,
  updateImageGallerySubCategory,
} from "../services/imageGalleryCatService";

export const getImageGalleryCategoryThunk = createAsyncThunk(
  "imageGalleryCat/getImageGalleryCategory",
  async (_, thunkAPI) => {
    try {
      const response = await getImageGalleryCategory();
      console.log("category thunk:", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getImageGallerySubCategoryThunk = createAsyncThunk(
  "imageGalleryCat/getImageGallerySubCategory",
  async (_, thunkAPI) => {
    try {
      const response = await getImageGallerySubCategory();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getImageGallerySubCategoryByCategoryThunk = createAsyncThunk(
  "imageGalleryCat/getImageGallerySubCategoryByCategory",
  async (imageCatId, thunkAPI) => {
    try {
      const response = await getImageGallerySubCategoryByCategory(imageCatId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const createImageGalleryCategoryThunk = createAsyncThunk(
  "imageGalleryCat/createImageGalleryCategory",
  async (name, thunkAPI) => {
    try {
      const response = await createImageGalleryCategory(name);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const createImageGallerySubCategoryThunk = createAsyncThunk(
  "imageGalleryCat/createImageGallerySubCategory",
  async (categoryData, thunkAPI) => {
    try {
      const response = await createImageGallerySubCategory(categoryData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteImageGalleryCategoryThunk = createAsyncThunk(
  "imageGalleryCat/deleteImageGalleryCategory",
  async (id, thunkAPI) => {
    try {
      const response = await deleteImageGalleryCategory(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteImageGallerySubCategoryThunk = createAsyncThunk(
  "imageGalleryCat/deleteImageGallerySubCategory",
  async (id, thunkAPI) => {
    try {
      const response = await deleteImageGallerySubCategory(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateImageGalleryCategoryThunk = createAsyncThunk(
  "imageGalleryCat/updateImageGalleryCategory",
  async ({ id, name }, thunkAPI) => {
    try {
      const response = await updateImageGalleryCategory(id, name);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateImageGallerySubCategoryThunk = createAsyncThunk(
  "imageGalleryCat/updateImageGallerySubCategory",
  async ({ id, name, imageCatId }, thunkAPI) => {
    try {
      const response = await updateImageGallerySubCategory(
        id,
        name,
        imageCatId
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
