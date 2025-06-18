
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchBirthdayData = createAsyncThunk(
  'message/fetchBirthdayData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:8080/api/birthday/getTodayData');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendBirthdayMessage = createAsyncThunk(
  'message/sendBirthdayMessage',
  async ({ receiverId, message }, { rejectWithValue }) => {
    try {
      
      const currentUser = JSON.parse(localStorage.getItem('authState'));
      
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const requestBody = {
        receiverId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        message
      };

      const response = await axios.post(
        'http://localhost:8080/api/birthday/sendMessage',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchInboxData = createAsyncThunk(
  'message/fetchInboxData',
  async (_, { rejectWithValue }) => {
    try {
      
      const currentUser = JSON.parse(localStorage.getItem('authState'));
      
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const response = await axios.get(
        `http://localhost:8080/api/birthday/inboxData?receiverId=${currentUser.id}`
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const fetchSenderMessages = createAsyncThunk(
  'message/fetchSenderMessages',
  async ({ senderId }, { rejectWithValue }) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('authState'));
      
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const response = await axios.post(
        'http://localhost:8080/api/birthday/viewSenderMessages',
        {
          receiverId: currentUser.id,
          senderId: senderId
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const messageSlice = createSlice({
  name: 'message',
  initialState: {
    birthdayData: [],
    inboxData: [],
    senderMessages: [],
    loading: false,
    error: null,
    sendingMessage: false,
    sendMessageError: null,
    inboxLoading: false,
    inboxError: null,
    senderMessagesLoading: false,
    senderMessagesError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBirthdayData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBirthdayData.fulfilled, (state, action) => {
        state.birthdayData = action.payload;
        state.loading = false;
      })
      .addCase(fetchBirthdayData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendBirthdayMessage.pending, (state) => {
        state.sendingMessage = true;
        state.sendMessageError = null;
      })
      .addCase(sendBirthdayMessage.fulfilled, (state) => {
        state.sendingMessage = false;
      })
      .addCase(sendBirthdayMessage.rejected, (state, action) => {
        state.sendingMessage = false;
        state.sendMessageError = action.payload;
      })
      .addCase(fetchInboxData.pending, (state) => {
        state.inboxLoading = true;
        state.inboxError = null;
      })
      .addCase(fetchInboxData.fulfilled, (state, action) => {
        state.inboxData = action.payload;
        state.inboxLoading = false;
      })
      .addCase(fetchInboxData.rejected, (state, action) => {
        state.inboxLoading = false;
        state.inboxError = action.payload;
      })
      .addCase(fetchSenderMessages.pending, (state) => {
        state.senderMessagesLoading = true;
        state.senderMessagesError = null;
      })
      .addCase(fetchSenderMessages.fulfilled, (state, action) => {
        state.senderMessages = action.payload;
        state.senderMessagesLoading = false;
      })
      .addCase(fetchSenderMessages.rejected, (state, action) => {
        state.senderMessagesLoading = false;
        state.senderMessagesError = action.payload;
      });
  }
});

export default messageSlice.reducer;