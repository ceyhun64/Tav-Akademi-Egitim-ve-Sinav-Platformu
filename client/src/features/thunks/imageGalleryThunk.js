import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllGalleries,
  getGalleryById,
  getGalleryByCategory,
  getGalleryBySubCategory,
  uploadSingleImage,
  uploadMultipleImages,
  deleteGallery,
  updateGallery,
} from "../services/imageGalleryService";

export const getAllGalleriesThunk = createAsyncThunk(
  "imageGallery/getAllGalleries",
  async (_, thunkAPI) => {
    try {
      const response = await getAllGalleries();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getGalleryByIdThunk = createAsyncThunk(
  "imageGallery/getGalleryById",
  async (id, thunkAPI) => {
    try {
      const response = await getGalleryById(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getGalleryByCategoryThunk = createAsyncThunk(
  "imageGallery/getGalleryByCategory",
  async (imageCatId, thunkAPI) => {
    try {
      const response = await getGalleryByCategory(imageCatId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getGalleryBySubCategoryThunk = createAsyncThunk(
  "imageGallery/getGalleryBySubCategory",
  async (imageSubCatId, thunkAPI) => {
    try {
      const response = await getGalleryBySubCategory(imageSubCatId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const uploadSingleImageThunk = createAsyncThunk(
  "imageGallery/uploadSingleImage",
  async (formData, thunkAPI) => {
    try {
      const response = await uploadSingleImage(formData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const uploadMultipleImagesThunk = createAsyncThunk(
  "imageGallery/uploadMultipleImages",
  async (formData, thunkAPI) => {
    try {
      const response = await uploadMultipleImages(formData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const deleteGalleryThunk = createAsyncThunk(
  "imageGallery/deleteGallery",
  async (id, thunkAPI) => {
    try {
      const response = await deleteGallery(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const updateGalleryThunk = createAsyncThunk(
  "imageGallery/updateGallery",
  async ({ id, formData }, thunkAPI) => {
    try {
      const response = await updateGallery(id, formData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
