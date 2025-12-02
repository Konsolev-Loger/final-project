import { createSlice } from '@reduxjs/toolkit';
import { initialUserState } from '../model/index';
import {
  signUpThunk,
  signInThunk,
  signOutThunk,
  refreshTokensThunk,
  updateUserThunk,
} from '../api/UserApi';

const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    initializeFromStorage: (state) => {
      const savedStatus = localStorage.getItem('authStatus');
      const savedUser = localStorage.getItem('userData');

      if (savedStatus === 'logged' && savedUser) {
        state.status = 'logged';
        state.user = JSON.parse(savedUser);
        state.isInitialized = true;
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(refreshTokensThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(refreshTokensThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.isInitialized = true;
      state.status = 'logged';
      state.user = action.payload;
    });
    builder.addCase(refreshTokensThunk.rejected, (state) => {
      state.isLoading = false;
      state.isInitialized = true;
      state.status = 'guest';
      state.user = null;
      state.error = null;
    });
    //!--------------------------------------------------------------------------------
    builder.addCase(signUpThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(signUpThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.isInitialized = true;
      state.status = 'logged';
      state.user = action.payload; //!CHECK THIS PLACE LATER
    });
    builder.addCase(signUpThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.status = 'guest';
      state.user = null;
      state.error = action.payload?.error || null;
    });
    //!--------------------------------------------------------------------------------
    builder.addCase(signInThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(signInThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.isInitialized = true;
      state.status = 'logged';
      state.user = action.payload;
    });
    builder.addCase(signInThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.status = 'guest';
      state.user = null;
      state.error = action.payload?.error || null;
    });
    //!--------------------------------------------------------------------------------
    builder.addCase(signOutThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(signOutThunk.fulfilled, (state) => {
      state.isLoading = false;
      state.status = 'guest';
      state.error = null;
      state.isInitialized = true;
      state.user = null;
      // localStorage.removeItem('authStatus');
      // localStorage.removeItem('userData'); //!CHECK THIS
    });
    builder.addCase(signOutThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.isInitialized = true;
      state.status = 'guest';
      state.user = null;
      state.error = action.payload?.error || null;
    });
    //!--------------------------------------------------------------------------------
    builder.addCase(updateUserThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateUserThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.user = action.payload;
      localStorage.setItem('userData', JSON.stringify(action.payload));
    });
    builder.addCase(updateUserThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.error || null;
    });
  },
});

// экспортируем редюсер слайса, чтобы подключить его в глобальное хранилище (store.ts в app/store/store.ts)
export const userReducer = userSlice.reducer;
export const { initializeFromStorage } = userSlice.actions;
