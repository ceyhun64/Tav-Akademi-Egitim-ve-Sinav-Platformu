import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  login,
  register,
  passwordEmail,
  updatePassword,
  logout,
  bulkRegister,
  uploadUserImages,
  adminLogin,
  verify2FA,
  setup2FA,
} from "../services/authService";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ kullanici_adi, sifre, token }, thunkAPI) => {
    try {
      const response = await login(kullanici_adi, sifre, token);
      if (response.data.sessionId) {
        localStorage.setItem("sessionId", response.data.sessionId);
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const adminLoginThunk = createAsyncThunk(
  "auth/adminLogin",
  async ({ kullanici_adi, sifre, token }, thunkAPI) => {
    try {
      const response = await adminLogin(kullanici_adi, sifre, token);
      if (response.data.sessionId) {
        localStorage.setItem("sessionId", response.data.sessionId);
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const setup2FAThunk = createAsyncThunk(
  "auth/setup2FA",
  async (userId, thunkAPI) => {
    try {
      const response = await setup2FA({ userId });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: error.message || "Bilinmeyen hata oluştu",
        }
      );
    }
  }
);
export const verify2FAThunk = createAsyncThunk(
  "auth/verify2FA",
  async ({ userId, token }, thunkAPI) => {
    try {
      const response = await verify2FA(userId, token);
      console.log("verify2FA thunk:", response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: error.message || "Bilinmeyen hata oluştu",
        }
      );
    }
  }
);
export const bulkRegisterThunk = createAsyncThunk(
  "auth/bulkRegister",
  async (formData, thunkAPI) => {
    try {
      const response = await bulkRegister(formData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: error.message || "Bilinmeyen hata oluştu",
        }
      );
    }
  }
);
export const uploadUserImagesThunk = createAsyncThunk(
  "auth/uploadUserImages",
  async (formData, thunkAPI) => {
    try {
      const response = await uploadUserImages(formData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: error.message || "Bilinmeyen hata oluştu",
        }
      );
    }
  }
);

export const verifyCodeThunk = createAsyncThunk(
  "auth/verifyCode",
  async ({ userId, code, sessionId }, thunkAPI) => {
    try {
      const response = await verifyCode(userId, code, sessionId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: error.message || "Bilinmeyen hata oluştu",
        }
      );
    }
  }
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (formData, thunkAPI) => {
    try {
      const response = await register(formData);
      return { ...response.data, token: response.token };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message || "Bilinmeyen hata" }
      );
    }
  }
);

export const passwordEmailThunk = createAsyncThunk(
  "auth/emailPassword",
  async ({ email }, thunkAPI) => {
    try {
      const response = await passwordEmail(email);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updatePasswordThunk = createAsyncThunk(
  "auth/updatePassword",
  async ({ token, sifre, yenisifre, tekraryenisifre }, thunkAPI) => {
    try {
      const response = await updatePassword(
        token,
        sifre,
        yenisifre,
        tekraryenisifre
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      const response = await logout();
      localStorage.removeItem("sessionId");
      localStorage.removeItem("token"); // eğer token varsa
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
