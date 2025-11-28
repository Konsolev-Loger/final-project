import { configureStore } from '@reduxjs/toolkit';
import calculatorReducer from './calculatorSlice';
import { userReducer } from '@/entities/user/slice/userSlice';
import { CategoryReducer } from '@/app/slice/CategorySlice';
export const store = configureStore({
  reducer: {
    calculator: calculatorReducer,
    user: userReducer,
    category: CategoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
