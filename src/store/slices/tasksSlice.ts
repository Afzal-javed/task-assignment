import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { taskService } from '@/services/task.service';
import { getApiErrorMessage } from '@/lib/api-client';
import type {
  ApiResponse,
  CreateTaskInput,
  TaskListParams,
  UpdateTaskInput,
} from '@/types';

export function getTasksQueryKey(params: TaskListParams): string {
  return JSON.stringify(params);
}

interface TaskQueryState {
  data: ApiResponse<import('@/types').Task[]> | null;
  isLoading: boolean;
  isError: boolean;
  invalidated: boolean;
}

interface TasksState {
  queries: Record<string, TaskQueryState>;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
}

const initialState: TasksState = {
  queries: {},
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
};

function ensureQuery(state: TasksState, key: string): TaskQueryState {
  if (!state.queries[key]) {
    state.queries[key] = {
      data: null,
      isLoading: false,
      isError: false,
      invalidated: false,
    };
  }
  return state.queries[key];
}

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (params: TaskListParams, { rejectWithValue }) => {
    try {
      return { params, data: await taskService.getTasks(params) };
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async (input: CreateTaskInput, { rejectWithValue }) => {
    try {
      return await taskService.createTask(input);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async (
    { id, input }: { id: string; input: UpdateTaskInput },
    { rejectWithValue }
  ) => {
    try {
      return await taskService.updateTask(id, input);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await taskService.deleteTask(id);
      return id;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    invalidateAllTasks(state) {
      Object.keys(state.queries).forEach((key) => {
        state.queries[key].invalidated = true;
      });
    },
    optimisticUpdateTask(
      state,
      action: PayloadAction<{ id: string; input: UpdateTaskInput }>
    ) {
      const { id, input } = action.payload;
      Object.values(state.queries).forEach((query) => {
        if (!query.data?.data) return;
        query.data = {
          ...query.data,
          data: query.data.data.map((task) =>
            task.id === id ? { ...task, ...input } : task
          ),
        };
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state, action) => {
        const key = getTasksQueryKey(action.meta.arg);
        const query = ensureQuery(state, key);
        query.isLoading = true;
        query.isError = false;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        const key = getTasksQueryKey(action.payload.params);
        const query = ensureQuery(state, key);
        query.isLoading = false;
        query.data = action.payload.data;
        query.invalidated = false;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        const key = getTasksQueryKey(action.meta.arg);
        const query = ensureQuery(state, key);
        query.isLoading = false;
        query.isError = true;
      })
      .addCase(createTask.pending, (state) => {
        state.createLoading = true;
      })
      .addCase(createTask.fulfilled, (state) => {
        state.createLoading = false;
      })
      .addCase(createTask.rejected, (state) => {
        state.createLoading = false;
      })
      .addCase(updateTask.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateTask.fulfilled, (state) => {
        state.updateLoading = false;
      })
      .addCase(updateTask.rejected, (state) => {
        state.updateLoading = false;
      })
      .addCase(deleteTask.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteTask.fulfilled, (state) => {
        state.deleteLoading = false;
      })
      .addCase(deleteTask.rejected, (state) => {
        state.deleteLoading = false;
      });
  },
});

export const { invalidateAllTasks, optimisticUpdateTask } = tasksSlice.actions;
export default tasksSlice.reducer;
