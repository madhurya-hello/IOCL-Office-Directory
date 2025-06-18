import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import employeeReducer from './employeeSlice.js';
import sidebarReducer from './sidebarSlice.js';
import messageReducer from './messageSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employee: employeeReducer,
    sidebar: sidebarReducer,
    message: messageReducer
  }
});

