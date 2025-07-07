import { createSlice } from "@reduxjs/toolkit";
import {
  getEducationSetsThunk,
  getEducationSetByIdThunk,
  getEducationSetsUserThunk,
  createEducationSetThunk,
  deleteEducationSetThunk,
  updateEducationSetThunk,
  updateEducationSetUserThunk,
  getCompletedEducationSetsThunk,
  assignUsersToEducationSetThunk,
} from "../thunks/educationSetThunk";

const initialState = {
  educationSets: [],
  educationSetUsers: [],
  educationSet: {},
  completedEducationSets: [],
  isLoading: false,
  isError: false,
  error: "",
};

const educationSetSlice = createSlice({
  name: "educationSet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET EDUCATION SET
      .addCase(getEducationSetsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEducationSetsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.educationSets = action.payload;
      })
      .addCase(getEducationSetsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })

      //GET EDUCATION SET BY ID
      .addCase(getEducationSetByIdThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEducationSetByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.educationSet = action.payload;
      })
      .addCase(getEducationSetByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })

      // GET EDUCATION SET USER
      .addCase(getEducationSetsUserThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEducationSetsUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.educationSetUsers = action.payload;
      })
      .addCase(getEducationSetsUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })

      // CREATE EDUCATION SET
      .addCase(createEducationSetThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createEducationSetThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.educationSets.push(action.payload);
      })
      .addCase(createEducationSetThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })

      // DELETE EDUCATION SET
      .addCase(deleteEducationSetThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteEducationSetThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.educationSets = state.educationSets.filter(
          (cat) => cat.id !== action.payload.id
        );
      })
      .addCase(deleteEducationSetThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })

      // UPDATE EDUCATION SET
      .addCase(updateEducationSetThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateEducationSetThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.educationSets = state.educationSets.map((cat) =>
          cat.id === action.payload.id ? action.payload : cat
        );
      })
      .addCase(updateEducationSetThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      // UPDATE EDUCATION SET USER
      .addCase(updateEducationSetUserThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateEducationSetUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.completedEducationSets = state.completedEducationSets.map((cat) =>
          cat.id === action.payload.id ? action.payload : cat
        );
      })
      .addCase(updateEducationSetUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      // ASSIGN USERS TO EDUCATION SET
      .addCase(assignUsersToEducationSetThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(assignUsersToEducationSetThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.educationSets = state.educationSets.map((cat) =>
          cat.id === action.payload.id ? action.payload : cat
        );
      })
      .addCase(assignUsersToEducationSetThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      // GET COMPLETED EDUCATION SETS
      .addCase(getCompletedEducationSetsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCompletedEducationSetsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.completedEducationSets = action.payload;
      })
      .addCase(getCompletedEducationSetsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      });
  },
});

export default educationSetSlice.reducer;
