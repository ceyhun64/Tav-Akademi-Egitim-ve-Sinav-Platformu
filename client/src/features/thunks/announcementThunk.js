import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  updateAnnouncement,
  getAnnouncementByUser,
} from "../services/announcementService";

// Tüm duyuruları getir
export const fetchAnnouncements = createAsyncThunk(
  "announcements/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAnnouncements();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Duyurular alınamadı."
      );
    }
  }
);

export const fetchAnnouncementByUser = createAsyncThunk(
  "announcements/fetchByUser",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAnnouncementByUser();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Duyurular alınamadı."
      );
    }
  }
);

// Yeni duyuru oluştur
export const addAnnouncement = createAsyncThunk(
  "announcements/add",
  async ({ institutionId, groupId, content }, { rejectWithValue }) => {
    try {
      const data = await createAnnouncement({
        institutionId,
        groupId,
        content,
      });
      console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Duyuru oluşturulamadı."
      );
    }
  }
);

// Duyuru sil
export const removeAnnouncement = createAsyncThunk(
  "announcements/delete",
  async (id, { rejectWithValue }) => {
    try {
      const data = await deleteAnnouncement(id);
      return { id, message: data.message }; // sadece id yeterlidir genellikle
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Duyuru silinemedi."
      );
    }
  }
);

// Duyuru güncelle
export const editAnnouncement = createAsyncThunk(
  "announcements/update",
  async ({ id, institutionId, groupId, content }, { rejectWithValue }) => {
    try {
      const data = await updateAnnouncement(id, {
        institutionId,
        groupId,
        content,
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Duyuru güncellenemedi."
      );
    }
  }
);
