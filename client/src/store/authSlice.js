import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../api/authService";

// Async thunk actions
export const loginWithGoogle = createAsyncThunk("auth/googleLogin", async (credential, { rejectWithValue }) => {
  try {
    const data = await authService.googleLogin(credential);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const loginWithEmail = createAsyncThunk("auth/emailLogin", async ({ email, password }, { rejectWithValue }) => {
  try {
    const data = await authService.login(email, password);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const registerUser = createAsyncThunk("auth/register", async ({ email, password }, { rejectWithValue }) => {
  try {
    const data = await authService.register(email, password);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Registration failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
    loading: false,
    error: null,
  },
  reducers: {
    // Logout
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
    },

    // Clear error
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Google Login
    builder
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.token = action.payload.access_token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        localStorage.setItem("token", action.payload.access_token);
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Email Login
    builder
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.token = action.payload.access_token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        localStorage.setItem("token", action.payload.access_token);
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;
