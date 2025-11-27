import { createAsyncThunk } from '@reduxjs/toolkit';
import { CategoryArrType, CategoryType, UpdateCategoryType } from '../type/CategoryType';
import type { ServerResponseType } from '@/shared/types/index';
import { axiosInstance } from '@/shared/lib/axiosInstance';

enum CATEGORY_THINK_TYPES {
  GET_ALL_CATEGORY = 'GET_CATEGORY',
  CET_CATEGORY_BY_ID = 'GET_CATEGORY_BY_ID',
  UPDATE_CATEGORY = 'UPDATE_CATEGORY',
  DELETE_CATEGORY = 'DELETE_CATEGORY',
}

export const getAllCategories = createAsyncThunk<
  CategoryArrType,
  void,
  { rejectValue: ServerResponseType<null> }
>(CATEGORY_THINK_TYPES.GET_ALL_CATEGORY, async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance('/category');
    const { data, statusCode } = response.data;
    if (statusCode !== 200) return rejectWithValue(data);
    return data;
  } catch (error) {
    return rejectWithValue(error as ServerResponseType<null>);
  }
});
// ==================================================================================
export const getCategoryById = createAsyncThunk<
  CategoryArrType,
  number,
  { rejectValue: ServerResponseType<null> }
>(CATEGORY_THINK_TYPES.CET_CATEGORY_BY_ID, async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance(`/category/${id}`);
    const { data, statusCode, error } = response.data;
    if (error || statusCode !== 200) {
      return rejectWithValue({
        statusCode: statusCode || 500,
        message: 'Не удалоось получить категорию',
        data: null,
        error: 'Не удалоось получить категорию',
      });
    }
    return data;
  } catch (error) {
    return rejectWithValue(error as ServerResponseType<null>);
  }
});
// ==================================================================================
export const updateCategory = createAsyncThunk<
  CategoryType,
  UpdateCategoryType,
  { rejectValue: ServerResponseType<null> }
>(CATEGORY_THINK_TYPES.UPDATE_CATEGORY, async ({ id, name }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/category/${id}`, { name });
    const { data, statusCode, error } = response.data;
    if (error || statusCode !== 200) {
      return rejectWithValue({
        statusCode: statusCode || 500,
        message: 'Не удалоось обновить категорию',
        data: null,
        error: 'Не удалоось обновить категорию',
      });
    }
    return data;
  } catch (error) {
    return rejectWithValue(error as ServerResponseType<null>);
  }
});
// ==================================================================================
export const deleteCategory = createAsyncThunk<
  number, // ожидаем
  number, // аргумент
  { rejectValue: ServerResponseType<null> }
>(CATEGORY_THINK_TYPES.DELETE_CATEGORY, async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete(`/category/${id}`);
    const { data, statusCode, error } = response.data;
    if (error || statusCode !== 200) {
      return rejectWithValue({
        statusCode: statusCode || 500,
        message: 'Не удалоось удалить категорию',
        data: null,
        error: 'Не удалоось удалить категорию',
      });
    }
    return data;
  } catch (error) {
    return rejectWithValue(error as ServerResponseType<null>);
  }
});
