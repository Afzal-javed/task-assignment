import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tasksReducer from './slices/tasksSlice';
import dashboardReducer from './slices/dashboardSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      tasks: tasksReducer,
      dashboard: dashboardReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
