// store/slices/cartSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import {
  getCartThunk,
  addCartItemThunk,
  deleteOneItemThink,
  deleteCartItemThunk,
  createOrderCart,
} from '@/app/api/CartApi';
import { inititalOrderState } from '../type/OrderType';

const cartSlice = createSlice({
  name: 'cart',
  initialState: inititalOrderState,
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // === GET CART ===
      .addCase(getCartThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(getCartThunk.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(getCartThunk.rejected, (state, action) => {
        state.error = action.payload?.message || 'Не удалось загрузить корзину';
      })

      // === ADD TO CART ===
      .addCase(addCartItemThunk.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(addCartItemThunk.rejected, (state, action) => {
        state.error = action.payload?.message || 'Не удалось добавить в корзину';
      })

      // === DELETE ONE ITEM ===
      .addCase(deleteOneItemThink.fulfilled, (state, action) => {
        state.cart = action.payload
        if (state.cart) {
          state.cart.items = state.cart.items?.filter((item) => item.id !== action.payload);
        }
      })
      // .addCase(deleteOneItemThink.fulfilled, (state, action) => {
      //   state.cart = action.payload;
      // })

      // === CLEAR CART ===
      .addCase(deleteCartItemThunk.fulfilled, (state) => {
        state.cart = null;
      })

      // === CHECKOUT ===
      .addCase(createOrderCart.fulfilled, (state) => {
        state.cart = null; // корзина очищается после оформления
      })
      .addCase(createOrderCart.rejected, (state, action) => {
        state.error = action.payload?.message || 'Не удалось оформить заказ';
      });
  },
});

export const { clearCartError } = cartSlice.actions;
export default cartSlice.reducer;

export const CartReducer = cartSlice.reducer;
