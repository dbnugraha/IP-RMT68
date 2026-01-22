import { createSlice } from "@reduxjs/toolkit";

const bussinessSlice = createSlice({
  name: "bussiness",
  initialState: {
    businesses: [],
    selectedBusiness: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchBusinessesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchBusinessesSuccess(state, action) {
      state.loading = false;
      state.businesses = action.payload;
    },
    fetchBusinessesFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    selectBusiness(state, action) {
      state.selectedBusiness = action.payload;
    },
  },
});

export const { fetchBusinessesStart, fetchBusinessesSuccess, fetchBusinessesFailure, selectBusiness } =
  bussinessSlice.actions;

export default bussinessSlice.reducer;
