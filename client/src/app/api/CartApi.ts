import { createAsyncThunk } from '@reduxjs/toolkit';
import { AddToCartItem, OrderType } from '../type/OrderType';
import { ServerResponseType } from '@/shared/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

enum CART_ITEM_THUNK_TYPES {
  GET_CART = 'GET_CART',
  ADD_CART = 'ADD_CART',
  DELETE_CART_ITEM = 'DELETE_CART_ITEM',
  DELETE_ONE_ITEM = 'DELETE_ONE_ITEM',
  CREATE_ORDER_CART = 'CREATE_ORDER_CART',
}

// ================================КОРЗИНА================================
export const getCartThunk = createAsyncThunk<
  OrderType,
  void,
  { rejectValue: ServerResponseType<null> }
>(CART_ITEM_THUNK_TYPES.GET_CART, async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/orders/cart');
    const { statusCode, error } = response.data;
    if (error || statusCode !== 200) {
      return rejectWithValue({
        statusCode: statusCode || 500,
        message: 'Не удалоось получить корзину',
        data: null,
        error: 'Не удалоось получить корзину',
      });
    }
    return response.data.data;
  } catch (error) {
    console.log(error);
    return rejectWithValue(error as ServerResponseType<null>);
  }
});

export const addCartItemThunk = createAsyncThunk<
  OrderType,
  AddToCartItem,
  { rejectValue: ServerResponseType<null> }
>(CART_ITEM_THUNK_TYPES.ADD_CART, async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/orders/cart', data);
    const { statusCode, error } = response.data;
    if (error || statusCode !== 200) {
      return rejectWithValue({
        statusCode: statusCode || 500,
        message: 'Не удалоось добавить товар в корзину',
        data: null,
        error: 'Не удалоось добавить товар в корзину',
      });
    }
    return response.data.data;
  } catch (error) {
    console.log(error);
    return rejectWithValue(error as ServerResponseType<null>);
  }
});

export const deleteCartItemThunk = createAsyncThunk<
  OrderType,
  void,
  { rejectValue: ServerResponseType<null> }
>(CART_ITEM_THUNK_TYPES.DELETE_CART_ITEM, async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete(`/orders/clearcart`);
    const { statusCode, error } = response.data;
    if (error || statusCode !== 200) {
      return rejectWithValue({
        statusCode: statusCode || 500,
        message: 'Не удалоось удалить товар из корзины',
        data: null,
        error: 'Не удалоось удалить товар из корзины',
      });
    }
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error as ServerResponseType<null>);
  }
});

export const deleteOneItemThink = createAsyncThunk<
  OrderType,
  number,
  { rejectValue: ServerResponseType<null> }
>(CART_ITEM_THUNK_TYPES.DELETE_ONE_ITEM, async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete(`/orders/cart/${id}`);
    const { statusCode, error } = response.data;
    if (error || statusCode !== 200) {
      return rejectWithValue({
        statusCode: statusCode || 500,
        message: 'Не удалоось удалить товар из корзины',
        data: null,
        error: 'Не удалоось удалить товар из корзины',
      });
    }
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error as ServerResponseType<null>);
  }
});

export const createOrderCart = createAsyncThunk<
  OrderType,
  { comment?: string },
  { rejectValue: ServerResponseType<null> }
>(CART_ITEM_THUNK_TYPES.CREATE_ORDER_CART, async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/orders/checkout`, payload);
    const { statusCode, error } = response.data;
    if (error || (statusCode !== 200 && statusCode !== 201)) {
      return rejectWithValue({
        statusCode: statusCode || 500,
        message: 'Не удалось оформить заказ',
        data: null,
        error: 'Не удалось оформить заказ',
      });
    }
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error as ServerResponseType<null>);
  }
});
