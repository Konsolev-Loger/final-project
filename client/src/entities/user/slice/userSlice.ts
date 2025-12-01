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
  initialState: initialUserState, // начальное состояние слайса
  reducers: {},
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
      state.user = action.payload?.user || null; //!CHECK THIS PLACE LATER
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
      state.status = 'logged';
      state.error = null;
      state.isInitialized = true;
      state.user = null;
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
    });
    builder.addCase(updateUserThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.error || null;
    });
  },
});

// экспортируем редюсер слайса, чтобы подключить его в глобальное хранилище (store.ts в app/store/store.ts)
export const userReducer = userSlice.reducer;
