import type { ServerResponseType } from '../../../shared/types/index';
import { createContext } from 'react';

export type UserSignUpDataType = {
  name: string;
  email: string;
  password: string;
  phone: string; //! CHECK THIS PLACE
};

export type UserSignInDataType = {
  email: string;
  password: string;
};

export type UserType = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  is_admin?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NewUserType = {
  name?: string;
  email?: string;
  phone?: string;
};

export type UserResponseType = {
  accessToken: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    is_admin?: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

export type UserServerResponseType = ServerResponseType<UserResponseType>;

export type UserStateType = {
  status: 'logged' | 'guest';
  user: UserType | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
};

export const initialUserState: UserStateType = {
  status: 'guest',
  user: null,
  isLoading: false,
  isInitialized: false,
  error: null,
};

// export type UserAction =
//   | {
//       type: 'UPDATE_USER';
//       payload: UserStateType;
//     }
//   | {
//       type: 'LOGOUT_USER';
//       payload: UserStateType;
//     };

export type UserContextType = {
  state: UserStateType;
  dispatch: React.Dispatch<any>;
  getUser: () => Promise<void>;
  updateUser: (data: NewUserType) => Promise<void>;
};

export const UserContextType = createContext<UserContextType | null>(null);
