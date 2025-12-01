import { configureStore } from '@reduxjs/toolkit';
import calculatorReducer from './calculatorSlice';
import { userReducer } from '@/entities/user/slice/userSlice';
import { CategoryReducer } from '@/app/slice/CategorySlice';
import { OrderReducer } from '@/app/slice/OrderSlice';
import { CartReducer } from '@/app/slice/CartSlice';
export const store = configureStore({
  reducer: {
    calculator: calculatorReducer,
    category: CategoryReducer,
    cart: CartReducer,
    order: OrderReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
