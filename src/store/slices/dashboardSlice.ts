import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { dashboardService } from '@/services/dashboard.service';
import { getApiErrorMessage } from '@/lib/api-client';
import type { DashboardStats } from '@/types';

interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  isError: boolean;
}

const initialState: DashboardState = {
  stats: null,
  isLoading: false,
  isError: false,
};

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getStats();
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    invalidateDashboardStats(state) {
      state.stats = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const { invalidateDashboardStats } = dashboardSlice.actions;
export default dashboardSlice.reducer;
