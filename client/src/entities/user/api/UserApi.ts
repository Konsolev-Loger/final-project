import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance, setAccessToken } from '@/shared/lib/axiosInstance';
import handleAxiosError from '@/shared/utils/handleAxiosError';
import type { ServerResponseType } from '@/shared/types';
import type { UserResponseType, UserSignInDataType, UserSignUpDataType, UserType } from '../model';

// перечисление названий thunk-ов

enum USER_THUNK_TYPES {
  REFRESH = 'user/refresh',
  SIGN_UP = 'user/signUp',
  SIGN_IN = 'user/signIn',
  SIGN_OUT = 'user/signOut',
}

// перечисление endpoint-ов (ручек на сервере)

enum USER_API_ENDPOINTS {
  REFRESH = '/auth/refresh',
  SIGN_UP = '/auth/signup',
  SIGN_IN = '/auth/signin',
  SIGN_OUT = '/auth/signout',
}

export const refreshTokensThunk = createAsyncThunk<
  UserType,
  void,
  { rejectValue: ServerResponseType<null> }
>(USER_THUNK_TYPES.REFRESH, async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ServerResponseType<UserResponseType>>(
      USER_API_ENDPOINTS.REFRESH,
      { withCredentials: true },
    );

    if (!response.data.data?.user) {
      return rejectWithValue({
        statusCode: 500,
        message: 'Не удалось обновить токены',
        data: null,
        error: 'Не удалось обновить токены',
      });
    }

    setAccessToken(response.data.data.accessToken || '');
    return response.data.data.user;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const signUpThunk = createAsyncThunk<
  UserType,
  UserSignUpDataType,
  { rejectValue: ServerResponseType<null> }
>(USER_THUNK_TYPES.SIGN_UP, async (signUpData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<ServerResponseType<UserResponseType>>(
      USER_API_ENDPOINTS.SIGN_UP,
      signUpData,
      { withCredentials: true },
    );

    if (!response.data.data?.user) {
      return rejectWithValue({
        statusCode: 500,
        message: 'Не удалось зарегистриоваться',
        data: null,
        error: 'Не удалось зарегистриоваться',
      });
    }

    setAccessToken(response.data.data.accessToken || '');
    return response.data.data.user;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const signInThunk = createAsyncThunk<
  UserType,
  UserSignInDataType,
  { rejectValue: ServerResponseType<null> }
>(USER_THUNK_TYPES.SIGN_IN, async (signInData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<ServerResponseType<UserResponseType>>(
      USER_API_ENDPOINTS.SIGN_IN,
      signInData,
      { withCredentials: true },
    );

    if (!response.data.data?.user) {
      return rejectWithValue({
        statusCode: 500,
        message: 'Не удалось войти в аккаунт',
        data: null,
        error: 'Не удалось войти в аккаунт',
      });
    }

    setAccessToken(response.data.data.accessToken || '');
    return response.data.data.user;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const signOutThunk = createAsyncThunk<void, void, { rejectValue: ServerResponseType<null> }>(
  USER_THUNK_TYPES.SIGN_OUT,
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.get<ServerResponseType<null>>(USER_API_ENDPOINTS.SIGN_OUT, {
        withCredentials: true,
      });
      setAccessToken('');
    } catch (error) {
      return rejectWithValue(handleAxiosError(error));
    }
  },
);
