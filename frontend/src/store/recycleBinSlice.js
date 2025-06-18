
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchRecycledData = createAsyncThunk(
  'recycleBin/fetchRecycledData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:8080/api/employees/getRecycledData');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteEmployeesForever = createAsyncThunk(
  'recycleBin/deleteForever',
  async (ids, { rejectWithValue }) => {
    try {
      await axios.delete('http://localhost:8080/api/employees/deleteForever', {
        data: { ids }
      });
      return ids;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const restoreEmployees = createAsyncThunk(
  'recycleBin/restore',
  async (ids, { rejectWithValue }) => {
    try {
      await axios.put('http://localhost:8080/api/employees/restoreFromRecycleBin', {
        ids
      });
      return ids;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const recycleBinSlice = createSlice({
  name: 'recycleBin',
  initialState: {
    items: [],
    loading: false,
    error: null,
    deleting: false,  
    recovering: false 
  },
  reducers: {
    removeItems: (state, action) => {
      const idsToRemove = action.payload;
      state.items = state.items.filter(item => !idsToRemove.includes(item.id));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecycledData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecycledData.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.map(item => ({
          ...item,
          selected: false
        }));
      })
      .addCase(fetchRecycledData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteEmployeesForever.pending, (state) => {
        state.deleting = true;
      })
      .addCase(deleteEmployeesForever.fulfilled, (state, action) => {
        
        state.deleting = false;
        const idsToRemove = action.payload;
        state.items = state.items.filter(item => !idsToRemove.includes(item.id));
      })
      .addCase(deleteEmployeesForever.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      })

      .addCase(restoreEmployees.pending, (state) => {
        state.recovering = true;
      })
      .addCase(restoreEmployees.fulfilled, (state, action) => {
        
        state.recovering = false;
        const idsToRemove = action.payload;
        state.items = state.items.filter(item => !idsToRemove.includes(item.id));
      })
      .addCase(restoreEmployees.rejected, (state, action) => {
        state.recovering = false;
        state.error = action.payload;
      });
      
  }
});

export const { removeItems } = recycleBinSlice.actions;
export default recycleBinSlice.reducer;