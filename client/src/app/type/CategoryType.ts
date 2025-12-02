import { createContext } from 'react';

export type CategoryType = {
  id: number;
  name: string;
  materials?: MaterialType[];
  createdAt?: string;
  updatedAt?: string;
};
export type MaterialType = {
  category_id: ReactNode;
  createdAt: string | number | Date;
  id: number;
  name: string;
  title?: string;
  description?: string;
  price: string;
  img: string;
  is_popular: boolean;
};
export type UpdateCategoryType = {
  id: number;
  name: string;
};
export type CategoryArrType = CategoryType[];

export type CategoryAction =
  | { type: 'GET_CATEGORY'; payload: CategoryArrType }
  | { type: 'GET_CATEGORY_BY_ID'; payload: CategoryType }
  | { type: 'UPDATE_CATEGORY'; payload: CategoryType | null }
  | { type: 'DELETE_CATEGORY'; payload: CategoryType | null }
  | { type: 'SET_ERROR'; payload: { error: string } };

export type CategoryStateType = {
  categories: CategoryArrType;
  category: CategoryType | null;
  error: string | null;
};

export type CategoryContextType = {
  state: CategoryStateType;
  dispatch: React.Dispatch<CategoryAction>;
  getAllCategories: () => Promise<void>;
  getCategoryById: (id: number) => Promise<void>;
  updateCategory: (id: number, data: UpdateCategoryType) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
};
export const initialCategoryState: CategoryStateType = {
  categories: [],
  category: null,
  error: null,
};
export const CategoryContext = createContext<CategoryContextType | undefined>(undefined);
