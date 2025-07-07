import { createSlice } from "@reduxjs/toolkit";
import {
  getUserDetailsThunk,
  updateUserDetailsThunk,
  getAllUsersThunk,
  deleteUsersThunk,
  aktifPasifUserThunk,
} from "../thunks/userThunk";

const initialState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get user details
      .addCase(getUserDetailsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserDetailsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedUser = action.payload; // doğru yer bu
      })
      .addCase(getUserDetailsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // get all users
      .addCase(getAllUsersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllUsersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // update user details
      .addCase(updateUserDetailsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserDetailsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedUser = action.payload;
      })
      .addCase(updateUserDetailsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // delete users
      .addCase(deleteUsersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUsersThunk.fulfilled, (state, action) => {
        state.isLoading = false;

        const deletedIds = Array.isArray(action.payload)
          ? action.payload
          : [action.payload]; // Tek bir ID ise array'e çevir

        state.users = state.users.filter(
          (user) => !deletedIds.includes(user.id)
        );
      })

      .addCase(deleteUsersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // aktif pasif
      .addCase(aktifPasifUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(aktifPasifUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(aktifPasifUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
