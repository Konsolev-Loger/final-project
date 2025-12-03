// store/slices/OrderSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { inititalOrderState } from '../type/OrderType';
import {
  createOrderThunk,
  getAllOrdersThunk,
  getOrderByUserThunk,
  updateOrderCommentThunk,
  //   updateOrderStatusThunk,
  deleteOrderThunk,
  updateOrderStatusThunk,
} from '../api/OrderApi';

const OrderSlice = createSlice({
  name: 'order',
  initialState: inititalOrderState,
  reducers: {},
  extraReducers: (builder) => {
    // CREATE ORDER
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.error = null;
        state.orders.push(action.payload);
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.error = action.payload?.message || 'Не удалось создать заказ';
      });
    // ==========================================================
    // GET ALL ORDERS
    builder
      .addCase(getAllOrdersThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(getAllOrdersThunk.fulfilled, (state, action) => {
        state.error = null;
        state.orders = action.payload;
      })
      .addCase(getAllOrdersThunk.rejected, (state, action) => {
        state.error = action.payload?.message || 'Не удалось загрузить заказы';
      });
    // ==========================================================
    // GET ORDER BY USER
    builder
      .addCase(getOrderByUserThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(getOrderByUserThunk.fulfilled, (state, action) => {
        state.userOrders = action.payload; 
        state.error = null;
      })
      .addCase(getOrderByUserThunk.rejected, (state, action) => {
        state.error = action.payload || 'Не удалось загрузить заказы пользователя';
      });
    // ==========================================================
    // UPDATE ORDER COMMENT
    builder
      .addCase(updateOrderCommentThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(updateOrderCommentThunk.fulfilled, (state, action) => {
        state.error = null;
        state.orders = state.orders.map((order) =>
          order.id === action.payload.id ? action.payload : order,
        );
        // Если это заказ текущего пользователя
        if (state.order?.id === action.payload.id) {
          state.order = action.payload;
        }
      })
      .addCase(updateOrderCommentThunk.rejected, (state, action) => {
        state.error = action.payload?.message || 'Не удалось обновить комментарий';
      });
    // ==========================================================
    // UPDATE ORDER STATUS
    builder
      .addCase(updateOrderStatusThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        state.error = null;

        // Если бэкенд вернул полный заказ — используем его
        if (action.payload && action.payload.id && action.payload.items !== undefined) {
          state.orders = state.orders.map((order) =>
            order.id === action.payload.id ? action.payload : order,
          );
        }
        // Если вернул только { id, status } — обновляем только статус
        else if (action.payload && 'id' in action.payload && 'status' in action.payload) {
          const { id, status } = action.payload;
          state.orders = state.orders.map((order) =>
            order.id === id ? { ...order, status } : order,
          );
        }
        // Если вообще просто true/false — можно даже по meta.arg.id взять
        // но это уже костыль
      })
      .addCase(updateOrderStatusThunk.rejected, (state, action) => {
        state.error = action.payload?.message || 'Не удалось обновить статус';
      });
    // ==========================================================
    // DELETE ORDER
    builder
      .addCase(deleteOrderThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteOrderThunk.fulfilled, (state, action) => {
        state.error = null;
        const deletedId = action.payload;
        state.orders = state.orders.filter((order) => order.id !== deletedId);
        if (state.order?.id === deletedId) {
          state.order = null;
        }
      })
      .addCase(deleteOrderThunk.rejected, (state, action) => {
        state.error = action.payload?.message || 'Не удалось удалить заказ';
      });
  },
});

export const OrderReducer = OrderSlice.reducer;
