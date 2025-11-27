import { createSlice } from '@reduxjs/toolkit';
import { initialUserState } from '../model/index';
import { signUpThunk, signInThunk, signOutThunk, refreshTokensThunk } from '../api/UserApi';

const userSlice = createSlice({
  name: 'user', // название слайса - сегмента глобального состояния, который хранит данные о пользователе
  initialState: initialUserState, // начальное состояние слайса
  reducers: {}, // reducers - функции, которые синхронно изменяют состояние слайса
  extraReducers(builder) {
    // extraReducers - функции, которые асинхронно изменяют состояние слайса (для thunks)
    // для каждой санки описываем три сценария: pending, fulfilled, rejected и меняем состояние соответствующим образом
    builder.addCase(refreshTokensThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(refreshTokensThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.isInitialized = true;
      state.user = action.payload;
    });
    builder.addCase(refreshTokensThunk.rejected, (state) => {
      state.isLoading = false;
      state.isInitialized = true;
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
      state.user = action.payload;
    });
    builder.addCase(signUpThunk.rejected, (state, action) => {
      state.isLoading = false;
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
      state.user = action.payload;
    });
    builder.addCase(signInThunk.rejected, (state, action) => {
      state.isLoading = false;
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
      state.error = null;
      state.isInitialized = true;
      state.user = null;
    });
    builder.addCase(signOutThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.isInitialized = true;
      state.user = null;
      state.error = action.payload?.error || null;
    });
  },
});

// экспортируем редюсер слайса, чтобы подключить его в глобальное хранилище (store.ts в app/store/store.ts)
export const userReducer = userSlice.reducer;
