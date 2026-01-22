import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as aiInsightService from "../api/aiInsightService";

// Async thunk actions
export const fetchLatestSummary = createAsyncThunk(
  "aiInsight/fetchSummary",
  async (businessId, { rejectWithValue }) => {
    try {
      const data = await aiInsightService.aiLatestSummary(businessId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch summary");
    }
  },
);

export const fetchLatestInsight = createAsyncThunk("aiInsight/fetchLatest", async (businessId, { rejectWithValue }) => {
  try {
    const data = await aiInsightService.aiLatestInsights(businessId);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch insight");
  }
});

export const generateInsight = createAsyncThunk(
  "aiInsight/generate",
  async ({ businessId, params }, { rejectWithValue }) => {
    try {
      const data = await aiInsightService.aiGenerateInsights(businessId, params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to generate insight");
    }
  },
);

export const sendEmailReport = createAsyncThunk(
  "aiInsight/sendEmail",
  async ({ businessId, id }, { rejectWithValue }) => {
    try {
      const data = await aiInsightService.sendAIReportToEmail(businessId, id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to send email");
    }
  },
);

export const deleteInsight = createAsyncThunk("aiInsight/delete", async ({ businessId, id }, { rejectWithValue }) => {
  try {
    const data = await aiInsightService.deleteAIInsight(businessId, id);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete insight");
  }
});

const aiInsightSlice = createSlice({
  name: "aiInsight",
  initialState: {
    latestInsight: null,
    latestSummary: null,
    loading: false,
    generating: false,
    sendingEmail: false,
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch latest summary
    builder
      .addCase(fetchLatestSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLatestSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.latestSummary = action.payload;
        state.error = null;
      })
      .addCase(fetchLatestSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch latest insight
    builder
      .addCase(fetchLatestInsight.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLatestInsight.fulfilled, (state, action) => {
        state.loading = false;
        state.latestInsight = action.payload;
        state.error = null;
      })
      .addCase(fetchLatestInsight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Generate insight
    builder
      .addCase(generateInsight.pending, (state) => {
        state.generating = true;
        state.error = null;
      })
      .addCase(generateInsight.fulfilled, (state, action) => {
        state.generating = false;
        state.latestInsight = action.payload.insight;
        state.error = null;
      })
      .addCase(generateInsight.rejected, (state, action) => {
        state.generating = false;
        state.error = action.payload;
      });

    // Send email report
    builder
      .addCase(sendEmailReport.pending, (state) => {
        state.sendingEmail = true;
        state.error = null;
      })
      .addCase(sendEmailReport.fulfilled, (state) => {
        state.sendingEmail = false;
        state.error = null;
      })
      .addCase(sendEmailReport.rejected, (state, action) => {
        state.sendingEmail = false;
        state.error = action.payload;
      });

    // Delete insight
    builder
      .addCase(deleteInsight.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInsight.fulfilled, (state) => {
        state.loading = false;
        state.latestInsight = null;
        state.latestSummary = null;
        state.error = null;
      })
      .addCase(deleteInsight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = aiInsightSlice.actions;

export default aiInsightSlice.reducer;
