import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  uploadFile,
  uploadMultipleFiles,
  getUploadedFilesByManager,
  getUploadedFilesByUser,
  deleteUploadedFile,
  updateDownloaded,
  getDownloadedUser,
} from "../services/uploadFileService";
export const uploadFileThunk = createAsyncThunk(
  "uploadFile/uploadFile",
  async (formData) => {
    try {
      const response = await uploadFile(formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const uploadMultipleFilesThunk = createAsyncThunk(
  "uploadFile/uploadMultipleFiles",
  async (formData) => {
    try {
      const response = await uploadMultipleFiles(formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const getUploadedFilesByManagerThunk = createAsyncThunk(
  "uploadFile/getUploadedFilesByManager",
  async () => {
    try {
      const response = await getUploadedFilesByManager();
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const getUploadedFilesByUserThunk = createAsyncThunk(
  "uploadFile/getUploadedFilesByUser",
  async () => {
    try {
      const response = await getUploadedFilesByUser();
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteUploadedFileThunk = createAsyncThunk(
  "uploadFile/deleteUploadedFile",
  async (ids) => {
    try {
      const response = await deleteUploadedFile(ids);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const updateDownloadedThunk = createAsyncThunk(
  "uploadFile/updateDownloaded",
  async (fileId) => {
    try {
      console.log(fileId);
      const response = await updateDownloaded(fileId);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const getDownloadedUserThunk = createAsyncThunk(
  "uploadFile/getDownloadedUser",
  async () => {
    try {
      const response = await getDownloadedUser();
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);
