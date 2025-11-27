import type { ServerResponseType } from '../../../shared/types/index';

export type UserSignUpDataType = {
  username: string;
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
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type UserResponseType = {
  accessToken: string;
  user: {
    id: number;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type UserServerResponseType = ServerResponseType<UserResponseType>;

export type UserStateType = {
  user: UserType | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
};

export const initialUserState: UserStateType = {
  user: null,
  isLoading: false,
  isInitialized: false,
  error: null,
};
