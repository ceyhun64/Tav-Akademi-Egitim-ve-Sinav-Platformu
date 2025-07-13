import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAnnouncements,
  addAnnouncement,
  removeAnnouncement,
  editAnnouncement,
  fetchAnnouncementByUser,
} from "../thunks/announcementThunk";

const initialState = {
  announcements: [],
  userAnnouncements: [],
  loading: false,
  error: null,
};

const announcementSlice = createSlice({
  name: "announcements",
  initialState,
  reducers: {
    resetAnnouncementError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Tüm duyurular
      .addCase(fetchAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements = action.payload;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Kullanıcının duyuruları
      .addCase(fetchAnnouncementByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncementByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userAnnouncements = action.payload;
      })
      .addCase(fetchAnnouncementByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Duyuru ekle
      .addCase(addAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements.push(action.payload);
      })
      .addCase(addAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Duyuru sil
      .addCase(removeAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements = state.announcements.filter(
          (a) => a.id !== action.payload.id
        );
      })
      .addCase(removeAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Duyuru güncelle
      .addCase(editAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.announcements.findIndex(
          (a) => a.id === action.payload.id
        );
        if (index !== -1) {
          state.announcements[index] = action.payload;
        }
      })
      .addCase(editAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetAnnouncementError } = announcementSlice.actions;

export default announcementSlice.reducer;
