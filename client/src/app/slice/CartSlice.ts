import { createSlice } from '@reduxjs/toolkit';
import { inititalOrderState } from '../type/OrderType';
import {
} from '../api/OrderApi';
import { addCartItemThunk, createOrderCart, deleteCartItemThunk, deleteOneItemThink, getCartThunk } from '../api/CartApi';

const CartSlice = createSlice({
  name: 'Cart',
  initialState: inititalOrderState,
  reducers: {},
  extraReducers: (builder) => {
    // ==================== GET CART ====================
    builder
      .addCase(getCartThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(getCartThunk.fulfilled, (state, action) => {
        state.cart = action.payload; // OrderType с is_cart: true
      })
      .addCase(getCartThunk.rejected, (state, action) => {
        state.error = action.payload?.message || 'Не удалось загрузить корзину';
        state.cart = null;
      });

    // ==================== ADD TO CART ====================
    builder
      .addCase(addCartItemThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(addCartItemThunk.fulfilled, (state, action) => {
        state.cart = action.payload; // бэкенд возвращает обновлённую корзину
      })
      .addCase(addCartItemThunk.rejected, (state, action) => {
        state.error = action.payload?.message || 'Не удалось добавить товар';
      });

    // ==================== DELETE ONE ITEM FROM CART ====================
    builder
      .addCase(deleteOneItemThink.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteOneItemThink.fulfilled, (state, action) => {
        // Бэкенд возвращает, например, id удалённого item или обновлённую корзину
        // Если возвращает обновлённую корзину — используй её:
        if (typeof action.payload === 'object') {
          state.cart = action.payload;
        } else {
          // Если возвращает только id — просто удаляем из items
          if (state.cart) {
            state.cart.items = state.cart.items?.filter((item) => item.id !== action.payload);
            // // Пересчитываем total_price, если нужно
            // if (state.cart.items?.length === 0) {
            //   state.cart = null;
            // }
          }
        }
      })
      .addCase(deleteOneItemThink.rejected, (state, action) => {
        state.error = action.payload?.message || 'Не удалось удалить товар';
      });

    // ==================== CLEAR CART (удалить всю корзину) ====================
    builder
      .addCase(deleteCartItemThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteCartItemThunk.fulfilled, (state) => {
        state.cart = null;
      })
      .addCase(deleteCartItemThunk.rejected, (state, action) => {
        state.error = action.payload?.message || 'Не удалось очистить корзину';
      });

    // ==================== CHECKOUT — создать заказ из корзины ====================
    builder
      .addCase(createOrderCart.pending, (state) => {
        state.error = null;
      })
      .addCase(createOrderCart.fulfilled, (state) => {
        // После успешного оформления — корзина очищается!
        state.cart = null;
        // Если хочешь сохранить новый заказ где-то — лучше делать это в OrderSlice
      })
      .addCase(createOrderCart.rejected, (state, action) => {
        state.error = action.payload?.message || 'Не удалось оформить заказ';
      });
  },
});

export const CartReducer = CartSlice.reducer;

