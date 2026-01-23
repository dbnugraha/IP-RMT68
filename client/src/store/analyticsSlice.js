import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as analyticsService from "../api/analyticsService";

// Async thunk actions
export const fetchDashboard = createAsyncThunk("analytics/fetchDashboard", async (businessId, { rejectWithValue }) => {
  try {
    const data = await analyticsService.dashboardAnalytics(businessId);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch dashboard");
  }
});

export const fetchFinancial = createAsyncThunk(
  "analytics/fetchFinancial",
  async ({ businessId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const data = await analyticsService.financialAnalytics(businessId, startDate, endDate);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch financial data");
    }
  },
);

export const fetchProfitability = createAsyncThunk(
  "analytics/fetchProfitability",
  async (businessId, { rejectWithValue }) => {
    try {
      const data = await analyticsService.profitabilityAnalytics(businessId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch profitability");
    }
  },
);

export const fetchPaymentMethods = createAsyncThunk(
  "analytics/fetchPaymentMethods",
  async (businessId, { rejectWithValue }) => {
    try {
      const data = await analyticsService.paymentMethodAnalytics(businessId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch payment methods");
    }
  },
);

export const fetchExpenses = createAsyncThunk("analytics/fetchExpenses", async (businessId, { rejectWithValue }) => {
  try {
    const data = await analyticsService.expensesAnalytics(businessId);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch expenses");
  }
});

export const fetchTopProducts = createAsyncThunk(
  "analytics/fetchTopProducts",
  async ({ businessId, limit = 10 }, { rejectWithValue }) => {
    try {
      const data = await analyticsService.topSellingProductsAnalytics(businessId, limit);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch top products");
    }
  },
);

export const fetchProductProfitability = createAsyncThunk(
  "analytics/fetchProductProfitability",
  async (businessId, { rejectWithValue }) => {
    try {
      const data = await analyticsService.productProfitabilityAnalytics(businessId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch product profitability");
    }
  },
);

export const fetchProductPerformance = createAsyncThunk(
  "analytics/fetchProductPerformance",
  async (businessId, { rejectWithValue }) => {
    try {
      const data = await analyticsService.productPerformanceAnalytics(businessId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch product performance");
    }
  },
);

export const fetchInventory = createAsyncThunk(
  "analytics/fetchInventory",
  async ({ businessId, threshold = 10 }, { rejectWithValue }) => {
    try {
      const data = await analyticsService.inventoryAnalytics(businessId, threshold);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch inventory");
    }
  },
);

export const fetchSalesTrends = createAsyncThunk(
  "analytics/fetchSalesTrends",
  async ({ businessId, period = "daily", startDate, endDate }, { rejectWithValue }) => {
    try {
      const data = await analyticsService.salesTrendsAnalytics(businessId, period, startDate, endDate);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch sales trends");
    }
  },
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    dashboard: null,
    financial: null,
    profitability: null,
    paymentMethods: null,
    expenses: null,
    topProducts: null,
    productProfitability: null,
    productPerformance: null,
    inventory: null,
    salesTrends: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearAnalytics(state) {
      state.dashboard = null;
      state.financial = null;
      state.profitability = null;
      state.paymentMethods = null;
      state.expenses = null;
      state.topProducts = null;
      state.productProfitability = null;
      state.productPerformance = null;
      state.inventory = null;
      state.salesTrends = null;
    },
  },
  extraReducers: (builder) => {
    // Dashboard
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
        state.error = null;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Financial
    builder
      .addCase(fetchFinancial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFinancial.fulfilled, (state, action) => {
        state.loading = false;
        state.financial = action.payload;
        state.error = null;
      })
      .addCase(fetchFinancial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Profitability
    builder
      .addCase(fetchProfitability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfitability.fulfilled, (state, action) => {
        state.loading = false;
        state.profitability = action.payload;
        state.error = null;
      })
      .addCase(fetchProfitability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Payment Methods
    builder
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentMethods = action.payload;
        state.error = null;
      })
      .addCase(fetchPaymentMethods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Expenses
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
        state.error = null;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Top Products
    builder
      .addCase(fetchTopProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.topProducts = action.payload;
        state.error = null;
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Product Profitability
    builder
      .addCase(fetchProductProfitability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductProfitability.fulfilled, (state, action) => {
        state.loading = false;
        state.productProfitability = action.payload;
        state.error = null;
      })
      .addCase(fetchProductProfitability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Product Performance
    builder
      .addCase(fetchProductPerformance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductPerformance.fulfilled, (state, action) => {
        state.loading = false;
        state.productPerformance = action.payload;
        state.error = null;
      })
      .addCase(fetchProductPerformance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Inventory
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.inventory = action.payload;
        state.error = null;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Sales Trends
    builder
      .addCase(fetchSalesTrends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.salesTrends = action.payload;
        state.error = null;
      })
      .addCase(fetchSalesTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearAnalytics } = analyticsSlice.actions;

export default analyticsSlice.reducer;
