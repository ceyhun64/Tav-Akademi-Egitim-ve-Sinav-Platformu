import { createSlice } from "@reduxjs/toolkit";
import {
  getPoolTeosThunk,
  getPoolTeoByIdThunk,
  createPoolTeoThunk,
  updatePoolTeoThunk,
  deletePoolTeoThunk,
  getPoolTeosByBookletIdThunk,
  uploadQuestionsFromExcelThunk,
} from "../thunks/poolTeoThunk";

const initialState = {
  poolTeos: [],
  poolTeo: null,
  loading: false,
  error: null,
};

const poolTeoSlice = createSlice({
  name: "poolTeo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET ALL
      .addCase(getPoolTeosThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPoolTeosThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.poolTeos = action.payload;
        state.error = null;
      })
      .addCase(getPoolTeosThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getPoolTeoByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPoolTeoByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.poolTeo = action.payload;
        state.error = null;
      })
      .addCase(getPoolTeoByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createPoolTeoThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPoolTeoThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.poolTeos.push(action.payload);
        state.error = null;
      })
      .addCase(createPoolTeoThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updatePoolTeoThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePoolTeoThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.poolTeos.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.poolTeos[index] = action.payload;
        }
        // Detay görünümdeki nesne güncellenmişse onu da yenile:
        if (state.poolTeo?.id === action.payload.id) {
          state.poolTeo = action.payload;
        }
        state.error = null;
      })
      .addCase(updatePoolTeoThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deletePoolTeoThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePoolTeoThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.poolTeos = state.poolTeos.filter(
          (item) => item.id !== action.payload
        );
        if (state.poolTeo?.id === action.payload) {
          state.poolTeo = null;
        }
        state.error = null;
      })
      .addCase(deletePoolTeoThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY BOOKLET ID
      .addCase(getPoolTeosByBookletIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPoolTeosByBookletIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.poolTeos = action.payload;
        state.error = null;
      })
      .addCase(getPoolTeosByBookletIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // UPLOAD QUESTIONS FROM EXCEL
      .addCase(uploadQuestionsFromExcelThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadQuestionsFromExcelThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.poolTeos = action.payload.results?.created || []; // SADECE DİZİYİ AL
        state.error = null;
      })

      .addCase(uploadQuestionsFromExcelThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default poolTeoSlice.reducer;
