import { createSlice } from "@reduxjs/toolkit";
import {
  createGroupThunk,
  deleteGroupThunk,
  getGroupsThunk,
  updateGroupThunk,
  createInstitutionThunk,
  deleteInstitutionThunk,
  getInstitutionsThunk,
  updateInstitutionThunk,
} from "../thunks/grpInstThunk";
const initialState = {
  groups: [],
  institutions: [],
  loading: false,
  error: null,
};
const grpInstSlice = createSlice({
  name: "grpinst",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getGroupsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGroupsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload;
      })
      .addCase(getGroupsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createGroupThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createGroupThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.groups.push(action.payload);
      })
      .addCase(createGroupThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteGroupThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteGroupThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = state.groups.filter(
          (group) => group.id !== action.payload.id
        );
      })
      .addCase(deleteGroupThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateGroupThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateGroupThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.groups.findIndex(
          (group) => group.id === action.payload.id
        );
        if (index !== -1) {
          state.groups[index] = action.payload;
        }
      })
      .addCase(updateGroupThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getInstitutionsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getInstitutionsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.institutions = action.payload;
      })
      .addCase(getInstitutionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createInstitutionThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createInstitutionThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.institutions.push(action.payload);
      })
      .addCase(createInstitutionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteInstitutionThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteInstitutionThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.institutions = state.institutions.filter(
          (institution) => institution.id !== action.payload.id
        );
      })
      .addCase(deleteInstitutionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateInstitutionThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateInstitutionThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.institutions.findIndex(
          (institution) => institution.id === action.payload.id
        );
        if (index !== -1) {
          state.institutions[index] = action.payload;
        }
      })
      .addCase(updateInstitutionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export default grpInstSlice.reducer;
