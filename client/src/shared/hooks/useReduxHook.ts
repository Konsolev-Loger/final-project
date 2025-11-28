import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';

export const useAppDispatch = () => useDispatch<AppDispatch>(); // чтобы отправить action или thunk из компонента в store
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; // чтобы получить данные из store
