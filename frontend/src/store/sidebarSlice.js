
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchRecycleCount = createAsyncThunk(
  'sidebar/fetchRecycleCount',
  async () => {
    const response = await axios.get('http://localhost:8080/api/employees/recycleCount');
    return response.data;
  }
);

export const fetchRequestCount = createAsyncThunk(
  'sidebar/fetchRequestCount',
  async () => {
    const response = await axios.get('http://localhost:8080/api/employees/requestCount');
    return response.data;
  }
);

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    recycleCount: 0,
    requestsCount: 0,
    status: 'idle', 
    error: null
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchRecycleCount.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRecycleCount.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.recycleCount = action.payload.recycleCount;
      })
      .addCase(fetchRecycleCount.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchRequestCount.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRequestCount.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.requestsCount = action.payload.requestsCount;
      })
      .addCase(fetchRequestCount.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default sidebarSlice.reducer;