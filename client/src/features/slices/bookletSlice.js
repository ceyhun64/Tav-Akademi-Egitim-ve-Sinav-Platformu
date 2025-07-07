import { createSlice } from "@reduxjs/toolkit";
import {
  getBookletsThunk,
  getBookletByTypeThunk,
  getBookletByIdThunk,
  createBookletThunk,
  updateBookletThunk,
  deleteBookletThunk,
  getTeoBookletsThunk,
  getImgBookletsThunk,
} from "../thunks/bookletThunk";

const initialState = {
  booklets: [],
  teoBooklets: [],
  imgBooklets: [],
  booklet: null,
  loading: false,
  error: null,
};

const bookletSlice = createSlice({
  name: "booklet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET ALL
      .addCase(getBookletsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookletsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.booklets = action.payload;
      })
      .addCase(getBookletsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // GET TEO
      .addCase(getTeoBookletsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTeoBookletsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.teoBooklets = action.payload;
      })
      .addCase(getTeoBookletsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // GET IMG
      .addCase(getImgBookletsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getImgBookletsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.imgBooklets = action.payload;
      })
      .addCase(getImgBookletsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY TYPE
      .addCase(getBookletByTypeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookletByTypeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.booklets = action.payload;
      })
      .addCase(getBookletByTypeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getBookletByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookletByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.booklet = action.payload;
      })
      .addCase(getBookletByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createBookletThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBookletThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.booklets.push(action.payload);
        state.booklet = action.payload;
      })
      .addCase(createBookletThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateBookletThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // UPDATE case'inde, teoBooklets ve imgBooklets de varsa güncelle
      .addCase(updateBookletThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.booklets = state.booklets.map((booklet) =>
          booklet.id === action.payload.id ? action.payload : booklet
        );
        state.teoBooklets = state.teoBooklets.map((booklet) =>
          booklet.id === action.payload.id ? action.payload : booklet
        );
        state.imgBooklets = state.imgBooklets.map((booklet) =>
          booklet.id === action.payload.id ? action.payload : booklet
        );
        state.booklet = action.payload;
      })
      .addCase(updateBookletThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteBookletThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBookletThunk.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId =
          typeof action.payload === "object" && action.payload.id
            ? action.payload.id
            : action.payload;
        state.booklets = state.booklets.filter(
          (booklet) => booklet.id !== deletedId
        );
        if (state.booklet?.id === deletedId) {
          state.booklet = null;
        }
      })
      .addCase(deleteBookletThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bookletSlice.reducer;
