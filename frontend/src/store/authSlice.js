import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser } from '../api/auth.js';


const loadState = () => {
  try {
    const serializedState = localStorage.getItem('authState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const safeState = {
      ...state,
      currentUser: state.currentUser ? {
        name: state.currentUser.name,
        email: state.currentUser.email,
        photoLink: state.currentUser.photoLink
        
      } : null
    };
    localStorage.setItem('authState', JSON.stringify(safeState));
  } catch (err) {
   
  }
};


const persistedState = loadState();

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      const userData = await loginUser({ email, password });
      return userData;
    } catch (error) {      
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: persistedState || {
    currentUser: null,
    
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      localStorage.removeItem('authState'); 
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.loading = false;
        state.error = null;
        saveState(state); 
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;