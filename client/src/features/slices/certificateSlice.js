import { createSlice } from "@reduxjs/toolkit";
import {
  getCompletedEducationSetsThunk,
  createCertificateThunk,
  getCertificatesThunk,
  getCourseNosThunk,
  getCourseTypesThunk,
  getEducatorsThunk,
  getRequestersThunk,
  createCourseNoThunk,
  createCourseTypeThunk,
  createEducatorThunk,
  createRequesterThunk,
  deleteCourseNoThunk,
  deleteCourseTypeThunk,
  deleteEducatorThunk,
  deleteRequesterThunk,
} from "../thunks/certificateThunk";

const initialState = {
  completedEducationSets: [],
  certificates: [],
  educators: [],
  courseNos: [],
  courseTypes: [],
  requesters: [],
  loading: false,
  error: null,
};

const setLoading = (state) => {
  state.loading = true;
  state.error = null;
};

const setError = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

const certificateSlice = createSlice({
  name: "certificate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Completed Education Sets
      .addCase(getCompletedEducationSetsThunk.pending, setLoading)
      .addCase(getCompletedEducationSetsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.completedEducationSets = action.payload;
      })
      .addCase(getCompletedEducationSetsThunk.rejected, setError)

      .addCase(createCertificateThunk.pending, setLoading)
      .addCase(createCertificateThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.completedEducationSets = action.payload;
      })
      .addCase(createCertificateThunk.rejected, setError)

      // Certificates
      .addCase(getCertificatesThunk.pending, setLoading)
      .addCase(getCertificatesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.certificates = action.payload;
      })
      .addCase(getCertificatesThunk.rejected, setError)

      // Course Nos
      .addCase(getCourseNosThunk.pending, setLoading)
      .addCase(getCourseNosThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.courseNos = action.payload;
      })
      .addCase(getCourseNosThunk.rejected, setError)

      .addCase(createCourseNoThunk.pending, setLoading)
      .addCase(createCourseNoThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.courseNos.push(action.payload);
      })
      .addCase(createCourseNoThunk.rejected, setError)

      .addCase(deleteCourseNoThunk.pending, setLoading)
      .addCase(deleteCourseNoThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.courseNos = state.courseNos.filter(
          (item) => item.id !== action.payload.id
        );
      })
      .addCase(deleteCourseNoThunk.rejected, setError)

      // Course Types
      .addCase(getCourseTypesThunk.pending, setLoading)
      .addCase(getCourseTypesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.courseTypes = action.payload;
      })
      .addCase(getCourseTypesThunk.rejected, setError)

      .addCase(createCourseTypeThunk.pending, setLoading)
      .addCase(createCourseTypeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.courseTypes.push(action.payload);
      })
      .addCase(createCourseTypeThunk.rejected, setError)

      .addCase(deleteCourseTypeThunk.pending, setLoading)
      .addCase(deleteCourseTypeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.courseTypes = state.courseTypes.filter(
          (item) => item.id !== action.payload.id
        );
      })
      .addCase(deleteCourseTypeThunk.rejected, setError)

      // Educators
      .addCase(getEducatorsThunk.pending, setLoading)
      .addCase(getEducatorsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.educators = action.payload;
      })
      .addCase(getEducatorsThunk.rejected, setError)

      .addCase(createEducatorThunk.pending, setLoading)
      .addCase(createEducatorThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.educators.push(action.payload);
      })
      .addCase(createEducatorThunk.rejected, setError)

      .addCase(deleteEducatorThunk.pending, setLoading)
      .addCase(deleteEducatorThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.educators = state.educators.filter(
          (item) => item.id !== action.payload.id
        );
      })
      .addCase(deleteEducatorThunk.rejected, setError)

      // Requesters
      .addCase(getRequestersThunk.pending, setLoading)
      .addCase(getRequestersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.requesters = action.payload;
      })
      .addCase(getRequestersThunk.rejected, setError)

      .addCase(createRequesterThunk.pending, setLoading)
      .addCase(createRequesterThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.requesters.push(action.payload);
      })
      .addCase(createRequesterThunk.rejected, setError)

      .addCase(deleteRequesterThunk.pending, setLoading)
      .addCase(deleteRequesterThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.requesters = state.requesters.filter(
          (item) => item.id !== action.payload.id
        );
      })
      .addCase(deleteRequesterThunk.rejected, setError);
  },
});

export default certificateSlice.reducer;
