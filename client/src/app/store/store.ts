import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from '../slice/userSlice';
import { questionReducer } from '../slice/QuestionSlice';

export const store = configureStore({
  reducer: {  question: questionReducer },
});
// =================база=====================
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
