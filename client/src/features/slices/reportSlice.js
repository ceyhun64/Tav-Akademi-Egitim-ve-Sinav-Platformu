import { createSlice } from "@reduxjs/toolkit";
import {
  getUserTeoResultsThunk,
  getUserImgResultsThunk,
  getUserResultDetailThunk,
  getUserEducationResultDetailThunk,
  getAllUserEducationSetsResultThunk,
  deleteUserExamResultThunk,
  deleteUserEducationResultThunk,
  getQuestionCategoryResultThunk,
  getImgQuestionResultThunk,
  getTeoQuestionResultThunk,
  getUserImgExamResultThunk,
  getUserTeoExamResultThunk,
} from "../thunks/reportThunk";

const initialState = {
  teoResultByUser: [],
  imgResultByUser: [],
  userTeoResults: [],
  userImgResults: [],
  userResultDetail: {},
  
  userEducationResultDetail: {},
  userEducationSetsResult: [],
  questionCategoryResult: {},
  imgQuestionResults: [],
  teoQuestionResults: [],
  isLoading: false,
  error: null,
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Teorik sınav sonuçları
      .addCase(getUserTeoResultsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserTeoResultsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userTeoResults = action.payload;
      })
      .addCase(getUserTeoResultsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Görsel sınav sonuçları
      .addCase(getUserImgResultsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserImgResultsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userImgResults = action.payload;
      })
      .addCase(getUserImgResultsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      //sınav sonuç detayları
      .addCase(getUserResultDetailThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserResultDetailThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userResultDetail = action.payload;
      })
      .addCase(getUserResultDetailThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      //Eğitim seti sonuç detayları
      .addCase(getUserEducationResultDetailThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserEducationResultDetailThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userEducationResultDetail = action.payload;
      })
      .addCase(getUserEducationResultDetailThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      ///Eğitim seti sonuçları
      .addCase(getAllUserEducationSetsResultThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getAllUserEducationSetsResultThunk.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.userEducationSetsResult = action.payload;
        }
      )
      .addCase(getAllUserEducationSetsResultThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      //Sınav sonuçlarını silme
      .addCase(deleteUserExamResultThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUserExamResultThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userImgResults = action.payload?.data || [];
        state.userTeoResults = action.payload?.data || [];
      })

      .addCase(deleteUserExamResultThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      //Eğitim seti sonuçlarını silme
      .addCase(deleteUserEducationResultThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUserEducationResultThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userEducationSetsResult = action.payload?.data || [];
      })
      .addCase(deleteUserEducationResultThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      //Kategoriye göre doğru yanlış getirme
      .addCase(getQuestionCategoryResultThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getQuestionCategoryResultThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.questionCategoryResult = action.payload;
      })
      .addCase(getQuestionCategoryResultThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      //Görsel soru sonuçları
      .addCase(getImgQuestionResultThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getImgQuestionResultThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.imgQuestionResults = action.payload;
      })
      .addCase(getImgQuestionResultThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      //Teorik soru sonuçları
      .addCase(getTeoQuestionResultThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTeoQuestionResultThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teoQuestionResults = action.payload;
      })
      .addCase(getTeoQuestionResultThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getUserTeoExamResultThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserTeoExamResultThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teoResultByUser = action.payload;
      })
      .addCase(getUserTeoExamResultThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getUserImgExamResultThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserImgExamResultThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.imgResultByUser = action.payload;
      })
      .addCase(getUserImgExamResultThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default reportSlice.reducer;
