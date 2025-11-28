import { createContext } from 'react';
import { MaterialType } from './CategoryType';

export type OrderType = {
  id: number;
  user_id: number;
  total_price: number;
  comment: string;
  status: boolean | null;
  is_cart: boolean;
  items?: OrderItemType[];
  castomRooms?: CastomRoomType[];
  createdAt: string;
  updatedAt: string;
};

export type CastomRoomType = {
  id: number;
  oder_id: number;
  name: string;
  area: number;
};
export type OrderItemType = {
  id?: number;
  order_id: number;
  material_id: number;
  room_id: number;
  castom_room_id: number | null;
  quantity: number;
  price_at: number;
  material?: MaterialType;
};
export type UpdateOrderType = {
  id: number;
  total_price?: number;
  comment?: string;
  status?: boolean;
};
export type CreateOrderType = {
  total_price: number;
  coment: string;
  status: boolean;
};

export type AddToCartItem = {
  material_id: number;
  price_at: number;
  quantity?: number;
  room_id?: number | null;
  castom_room_id?: number | null;
};

export type OrderArrType = OrderType[];

export type OredrAction =
  | { type: 'CREATE_ORDER'; payload: OrderType }
  | { type: 'GET_ORDERS'; payload: OrderArrType }
  | { type: 'GET_ORDER_BY_USER'; payload: OrderType }
  | { type: 'UPDATE_ORDER'; payload: OrderType | null }
  | { type: 'DELETE_ORDER'; payload: OrderType | null }
  | { type: 'SET_ERROR'; payload: { error: string } }
  // =======================================================
  | { type: 'GET_CART'; payload: OrderType }
  | { type: 'ADD_CART'; payload: OrderType }
  | { type: 'DELETE_CART_ITEM'; payload: OrderType }
  | { type: 'DELETE_ONE_ITEM'; payload: OrderType }
  | { type: 'CREATE_ORDER_CART'; payload: OrderType }; // Возможно нужно будет изменить или удалить

export type OrderStateType = {
  orders: OrderArrType;
  order: OrderType | null;
  cart: OrderType | null;
  error: string | null;
};
export type OrderContextType = {
  state: OrderStateType;
  dispatch: React.Dispatch<OredrAction>;
  createOrder: (data: OrderType) => Promise<void>;
  getAllOrders: () => Promise<void>;
  getOrderByUserId: (id: number) => Promise<void>;
  updateOrder: (id: number, data: UpdateOrderType) => Promise<void>;
  deleteOrder: (id: number) => Promise<void>;
  // ===========================================================
  getCart: () => Promise<void>;
  addCart: (data: AddToCartItem) => Promise<void>;
  deleteCartItem: () => Promise<void>;
  deleteOneItem: (itemId: number) => Promise<void>;
  createOrderCart: (comment?: string) => Promise<void>;
};

export const inititalOrderState: OrderStateType = {
  orders: [],
  cart: null,
  order: null,
  error: null,
};

export const OrderContext = createContext<OrderContextType | undefined>(undefined);
