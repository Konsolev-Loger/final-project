import { createAsyncThunk } from '@reduxjs/toolkit';
import { CreateOrderType, OrderArrType, OrderType, UpdateOrderType } from '../type/OrderType';
import { ServerResponseType } from '@/shared/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

enum ORDER_THUNK_TYPES {
  CREATE_ORDER = 'CREATE_ORDER',
  GET_ORDERS = 'GET_ORDERS',
  GET_ORDER_BY_USER = 'GET_ORDER_BY_USER',
  UPDATE_ORDER = 'UPDATE_ORDER',
  DELETE_ORDER = 'DELETE_ORDER',
}

export const createOrderThunk = createAsyncThunk<
  OrderType,
  CreateOrderType,
  { rejectValue: ServerResponseType<null> }
>(ORDER_THUNK_TYPES.CREATE_ORDER, async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/orders', data);
    const { statusCode, error } = response.data;
    if (error || statusCode !== 200) {
      return rejectWithValue({
        statusCode: statusCode || 500,
        message: 'Не удалоось создать заказ',
        data: null,
        error: 'Не удалоось создать заказ',
      });
    }
    return response.data.data;
  } catch (error) {
    console.log(error);
    return rejectWithValue(error as ServerResponseType<null>);
  }
});

export const getAllOrdersThunk = createAsyncThunk<
  OrderArrType,
  void,
  { rejectValue: ServerResponseType<null> }
>(ORDER_THUNK_TYPES.GET_ORDERS, async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/orders');
    console.log(response);

    const { statusCode, error } = response.data;
    if (error || statusCode !== 200) {
      return rejectWithValue({
        statusCode: statusCode || 500,
        message: 'Не удалоось получить заказы',
        data: null,
        error: 'Не удалоось получить заказы',
      });
    }
    return response.data.data;
  } catch (error) {
    console.log(error);
    return rejectWithValue(error as ServerResponseType<null>);
  }
});
export const getOrderByUserThunk = createAsyncThunk<
  OrderType,
  void,
  { rejectValue: ServerResponseType<null> }
>(ORDER_THUNK_TYPES.GET_ORDER_BY_USER, async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/orders/user`);
    const { statusCode, error } = response.data;
    if (error || statusCode !== 200) {
      return rejectWithValue({
        statusCode: statusCode || 500,
        message: 'Не удалоось получить заказ',
        data: null,
        error: 'Не удалоось получить заказ',
      });
    }
    return response.data.data;
  } catch (error) {
    console.log(error);
    return rejectWithValue(error as ServerResponseType<null>);
  }
});

export const updateOrderCommentThunk = createAsyncThunk<
  OrderType,
  UpdateOrderType,
  { rejectValue: ServerResponseType<null> }
>(ORDER_THUNK_TYPES.UPDATE_ORDER, async ({ id, comment }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/orders/comment/${id}`, { comment });
    const { statusCode, error } = response.data;
    if (error || statusCode !== 200) {
      return rejectWithValue({
        statusCode: statusCode || 500,
        message: 'Не удалоось обновить заказ',
        data: null,
        error: 'Не удалоось обновить заказ',
      });
    }
    return response.data.data;
  } catch (error) {
    console.log(error);
    return rejectWithValue(error as ServerResponseType<null>);
  }
});

export const updateOrderStatusThunk = createAsyncThunk<
  OrderType,
  UpdateOrderType,
  { rejectValue: ServerResponseType<null> }
>(ORDER_THUNK_TYPES.UPDATE_ORDER, async ({ id, status }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/orders/${id}`, { status });
    const { statusCode, error } = response.data;
    if (error || statusCode !== 200) {
      return rejectWithValue({
        statusCode: statusCode || 500,
        message: 'Не удалоось обновить статус заказа',
        data: null,
        error: 'Не удалоось обновить статус заказа',
      });
    }
    return response.data.data;
  } catch (error) {
    console.log(error);
    return rejectWithValue(error as ServerResponseType<null>);
  }
});

export const deleteOrderThunk = createAsyncThunk<
  number, // ожидаем
  number, // аргумент
  { rejectValue: ServerResponseType<null> }
>(ORDER_THUNK_TYPES.DELETE_ORDER, async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete(`/orders/${id}`);
    const { data, statusCode, error } = response.data;
    if (error || statusCode !== 200) {
      return rejectWithValue({
        statusCode: statusCode || 500,
        message: 'Не удалоось удалить заказ',
        data: null,
        error: 'Не удалоось удалить заказ',
      });
    }
    return data;
  } catch (error) {
    return rejectWithValue(error as ServerResponseType<null>);
  }
});
