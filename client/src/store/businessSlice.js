import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as businessService from "../api/businessService";

// Async thunk actions
export const fetchMyBusinesses = createAsyncThunk("business/fetchMy", async (_, { rejectWithValue }) => {
  try {
    const data = await businessService.fetchMyBusiness();
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Failed to fetch businesses" });
  }
});

export const fetchBusinessById = createAsyncThunk("business/fetchById", async (businessId, { rejectWithValue }) => {
  try {
    const data = await businessService.fetchBusinessById(businessId);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Failed to fetch business" });
  }
});

export const createNewBusiness = createAsyncThunk("business/create", async (businessData, { rejectWithValue }) => {
  try {
    const data = await businessService.createBusiness(businessData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Failed to create business" });
  }
});

export const updateExistingBusiness = createAsyncThunk(
  "business/update",
  async ({ businessId, businessData }, { rejectWithValue }) => {
    try {
      const data = await businessService.updateBusiness(businessId, businessData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to update business" });
    }
  },
);

export const removeBusiness = createAsyncThunk("business/delete", async (businessId, { rejectWithValue }) => {
  try {
    await businessService.deleteBusiness(businessId);
    return businessId;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Failed to delete business" });
  }
});

const businessSlice = createSlice({
  name: "business",
  initialState: {
    businesses: [],
    selectedBusiness: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Manually select a business
    selectBusiness(state, action) {
      state.selectedBusiness = action.payload;
    },

    // Clear error
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch my businesses
    builder
      .addCase(fetchMyBusinesses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBusinesses.fulfilled, (state, action) => {
        state.loading = false;
        state.businesses = action.payload;
        state.error = null;
      })
      .addCase(fetchMyBusinesses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch business by ID
    builder
      .addCase(fetchBusinessById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinessById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBusiness = action.payload;
        state.error = null;
      })
      .addCase(fetchBusinessById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create business
    builder
      .addCase(createNewBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.businesses.push(action.payload);
        state.error = null;
      })
      .addCase(createNewBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update business
    builder
      .addCase(updateExistingBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExistingBusiness.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.businesses.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.businesses[index] = action.payload;
        }
        if (state.selectedBusiness?.id === action.payload.id) {
          state.selectedBusiness = action.payload;
        }
        state.error = null;
      })
      .addCase(updateExistingBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete business
    builder
      .addCase(removeBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.businesses = state.businesses.filter((b) => b.id !== action.payload);
        if (state.selectedBusiness?.id === action.payload) {
          state.selectedBusiness = null;
        }
        state.error = null;
      })
      .addCase(removeBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { selectBusiness, clearError } = businessSlice.actions;

export default businessSlice.reducer;
