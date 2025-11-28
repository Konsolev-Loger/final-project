import { createSlice } from '@reduxjs/toolkit';
import { initialCategoryState } from '../type/CategoryType';
import {
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from '../api/CategoryApi';

const CategorySlice = createSlice({
  name: 'category',
  initialState: initialCategoryState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCategoryById.pending, (state) => {
      state.error = null;
    });
    builder.addCase(getCategoryById.fulfilled, (state, action) => {
      state.error = null;
      state.category = action.payload;
    });
    builder.addCase(getCategoryById.rejected, (state, action) => {
      state.error = action.payload?.message || 'Ошибка сервера';
    });
    // ==========================================================
    builder.addCase(getAllCategories.pending, (state) => {
      state.error = null;
    });
    builder.addCase(getAllCategories.fulfilled, (state, action) => {
      state.error = null;
      state.categories = action.payload;
    });
    builder.addCase(getAllCategories.rejected, (state, action) => {
      state.error = action.payload?.message || 'Ошибка сервера';
    });
    // ==========================================================
    builder.addCase(updateCategory.pending, (state) => {
      state.error = null;
    });
    builder.addCase(updateCategory.fulfilled, (state, action) => {
      state.error = null;
      state.categories = state.categories.map((category) =>
        category.id === action.payload.id ? action.payload : category,
      );
    });
    builder.addCase(updateCategory.rejected, (state, action) => {
      state.error = action.payload?.message || 'Ошибка сервера';
    });
    // ==========================================================
    builder.addCase(deleteCategory.pending, (state) => {
      state.error = null;
    });
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.error = null;
      state.categories = state.categories.filter((category) => category.id !== action.payload);
    });
    builder.addCase(deleteCategory.rejected, (state, action) => {
      state.error = action.payload?.message || 'Ошибка сервера';
    });
    // ==========================================================
  },
});
export const CategoryReducer = CategorySlice.reducer;
