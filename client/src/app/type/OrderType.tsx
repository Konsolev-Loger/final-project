import { createContext } from 'react';
import { MaterialType } from './CategoryType';

export type OrderType = {
  id: number;
  user_id: number;
  total_price: number;
  comment: string;
  status: boolean;
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
  oder_id: number;
  material_id: number;
  room_id: number;
  castom_room_id: number;
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

export type OrderArrType = OrderType[];

export type OredrAction =
  | { type: 'CREATE_ORDER'; payload: OrderType }
  | { type: 'GET_ORDERS'; payload: OrderArrType }
  | { type: 'GET_ORDER_BY_USER'; payload: OrderType }
  | { type: 'UPDATE_ORDER'; payload: OrderType | null }
  | { type: 'DELETE_ORDER'; payload: OrderType | null }
  | { type: 'SET_ERROR'; payload: { error: string } };

export type OrderStateType = {
  orders: OrderArrType;
  order: OrderType | null;
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
};

export const inititalOrderState: OrderStateType = {
  orders: [],
  order: null,
  error: null,
};

export const OrderContext = createContext<OrderContextType | undefined>(undefined);
