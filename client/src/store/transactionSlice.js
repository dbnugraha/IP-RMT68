import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as transactionService from "../api/transactionService";

// Async thunk actions
export const fetchTransactions = createAsyncThunk("transaction/fetchAll", async (businessId, { rejectWithValue }) => {
  try {
    const data = await transactionService.fetchTransactionsByBusiness(businessId);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch transactions");
  }
});

export const fetchStats = createAsyncThunk("transaction/fetchStats", async (businessId, { rejectWithValue }) => {
  try {
    const data = await transactionService.fetchTransactionStats(businessId);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch statistics");
  }
});

export const fetchTransactionById = createAsyncThunk(
  "transaction/fetchById",
  async ({ businessId, transactionId }, { rejectWithValue }) => {
    try {
      const data = await transactionService.fetchTransactionById(businessId, transactionId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch transaction");
    }
  },
);

export const createNewTransaction = createAsyncThunk(
  "transaction/create",
  async ({ businessId, transactionData }, { rejectWithValue }) => {
    try {
      const data = await transactionService.createTransaction(businessId, transactionData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create transaction");
    }
  },
);

export const updateExistingTransaction = createAsyncThunk(
  "transaction/update",
  async ({ businessId, transactionId, transactionData }, { rejectWithValue }) => {
    try {
      const data = await transactionService.updateTransaction(businessId, transactionId, transactionData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update transaction");
    }
  },
);

export const removeTransaction = createAsyncThunk(
  "transaction/delete",
  async ({ businessId, transactionId }, { rejectWithValue }) => {
    try {
      await transactionService.deleteTransaction(businessId, transactionId);
      return transactionId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete transaction");
    }
  },
);

const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    transactions: [],
    stats: null,
    selectedTransaction: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Manually select a transaction
    selectTransaction(state, action) {
      state.selectedTransaction = action.payload;
    },

    // Clear error
    clearError(state) {
      state.error = null;
    },

    // Clear all transactions
    clearTransactions(state) {
      state.transactions = [];
      state.stats = null;
      state.selectedTransaction = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all transactions
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
        state.error = null;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch statistics
    builder
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch transaction by ID
    builder
      .addCase(fetchTransactionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTransaction = action.payload;
        state.error = null;
      })
      .addCase(fetchTransactionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create transaction
    builder
      .addCase(createNewTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.push(action.payload);
        state.error = null;
      })
      .addCase(createNewTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update transaction
    builder
      .addCase(updateExistingTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExistingTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.transactions.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
        if (state.selectedTransaction?.id === action.payload.id) {
          state.selectedTransaction = action.payload;
        }
        state.error = null;
      })
      .addCase(updateExistingTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete transaction
    builder
      .addCase(removeTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = state.transactions.filter((t) => t.id !== action.payload);
        if (state.selectedTransaction?.id === action.payload) {
          state.selectedTransaction = null;
        }
        state.error = null;
      })
      .addCase(removeTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { selectTransaction, clearError, clearTransactions } = transactionSlice.actions;

export default transactionSlice.reducer;
