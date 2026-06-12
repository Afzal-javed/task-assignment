import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authService } from '@/services/auth.service';
import {
  clearAuth,
  getStoredUser,
  setStoredUser,
  setToken,
} from '@/lib/auth-storage';
import { getApiErrorMessage } from '@/lib/api-client';
import type { LoginInput, RegisterInput, User } from '@/types';

interface AuthState {
  user: User | null;
  loginLoading: boolean;
  registerLoading: boolean;
  logoutLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loginLoading: false,
  registerLoading: false,
  logoutLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (input: LoginInput, { rejectWithValue }) => {
    try {
      return await authService.login(input);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (input: RegisterInput, { rejectWithValue }) => {
    try {
      return await authService.register(input);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try {
    await authService.logout();
  } catch {
    // Always clear local session even if API fails
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    hydrateAuth(state) {
      state.user = getStoredUser();
    },
    clearAuthState(state) {
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginLoading = false;
        state.user = action.payload.user;
        setToken(action.payload.accessToken);
        setStoredUser(action.payload.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginLoading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.registerLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registerLoading = false;
        state.user = action.payload.user;
        setToken(action.payload.accessToken);
        setStoredUser(action.payload.user);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.pending, (state) => {
        state.logoutLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.logoutLoading = false;
        state.user = null;
        clearAuth();
      })
      .addCase(logoutUser.rejected, (state) => {
        state.logoutLoading = false;
        state.user = null;
        clearAuth();
      });
  },
});

export const { hydrateAuth, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
