import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance, setAccessToken } from '@/shared/lib/axiosInstance';
import handleAxiosError from '@/shared/utils/handleAxiosError';
import type { ServerResponseType } from '@/shared/types';
import type {
  UserResponseType,
  UserSignInDataType,
  UserSignUpDataType,
  UserType,
  NewUserType,
} from '../model';

enum USER_THUNK_TYPES {
  REFRESH = 'user/refresh',
  SIGN_UP = 'user/signUp',
  SIGN_IN = 'user/signIn',
  SIGN_OUT = 'user/signOut',
  UPDATE_USER = 'user/updateUser',
  UPDATE_USER_AS_ADMIN = 'user/updateUserAsAdmin',
}

enum USER_API_ENDPOINTS {
  REFRESH = '/users/refreshTokens',
  SIGN_UP = '/users/registration',
  SIGN_IN = '/users/login',
  SIGN_OUT = '/users/logout',
  UPDATE_USER = '/users/profile',
  UPDATE_USER_AS_ADMIN = '/admin/users/',
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
    console.log(response);
    setAccessToken(response.data.data.accessToken || '');
    return response.data.data.user;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

// export const signUpThunk = createAsyncThunk<
//   UserType,
//   UserSignUpDataType,
//   { rejectValue: ServerResponseType<null> }
// >(USER_THUNK_TYPES.SIGN_UP, async (signUpData, { rejectWithValue }) => {
export const signUpThunk = createAsyncThunk<
  UserType,
  UserSignUpDataType,
  { rejectValue: ServerResponseType<null> }
>(USER_THUNK_TYPES.SIGN_UP, async (signUpData, { rejectWithValue }) => {
  try {
    // const response = await axiosInstance.post<ServerResponseType<UserResponseType>>(
    //   USER_API_ENDPOINTS.SIGN_UP,
    //   signUpData,
    //   { withCredentials: true },
    // );
    const response = await axiosInstance.post(USER_API_ENDPOINTS.SIGN_UP, signUpData);
    const { statusCode, error } = response.data;
    if (error || statusCode !== 200) {
      return rejectWithValue({
        statusCode: statusCode || 500,
        message: 'Не удалось зарегистриоваться',
        data: null,
        error: 'Не удалось зарегистриоваться',
      });
    }
    // if (!response.data.data?.user) {
    //   return rejectWithValue({
    //     statusCode: 500,
    //     message: 'Не удалось зарегистриоваться',
    //     data: null,
    //     error: 'Не удалось зарегистриоваться',
    //   });
    // }

    setAccessToken(response.data.accessToken || '');
    return response.data.data.user;
    // return;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

// export const signInThunk = createAsyncThunk<
//   UserType,
//   UserSignInDataType,
//   { rejectValue: ServerResponseType<null> }
// >(USER_THUNK_TYPES.SIGN_IN, async (signInData, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.post<ServerResponseType<UserResponseType>>(
//       USER_API_ENDPOINTS.SIGN_IN,
//       signInData,
//       { withCredentials: true },
//     );

//     if (!response.data.data?.user) {
//       return rejectWithValue({
//         statusCode: 500,
//         message: 'Не удалось войти в аккаунт',
//         data: null,
//         error: 'Не удалось войти в аккаунт',
//       });
//     }

//     setAccessToken(response.data.data.accessToken || '');
//     return response.data.data.user;
//   } catch (error) {
//     return rejectWithValue(handleAxiosError(error));
//   }
// });

export const signInThunk = createAsyncThunk<
  void,
  UserSignInDataType,
  { rejectValue: ServerResponseType<null> }
>(USER_THUNK_TYPES.SIGN_IN, async (signInData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(USER_API_ENDPOINTS.SIGN_IN, signInData, {
      withCredentials: true,
    });

    setAccessToken(response.data.accessToken);
    return;
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

export const updateUserThunk = createAsyncThunk<
  UserType,
  { id: number; data: NewUserType },
  { rejectValue: ServerResponseType<null> }
>(USER_THUNK_TYPES.UPDATE_USER, async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`${USER_API_ENDPOINTS.UPDATE_USER}/${id}`, data, {
      withCredentials: true,
    });
    return response.data.user;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const updateUserAsAdminThunk = createAsyncThunk<
  UserType,
  { userId: number; data: any },
  { rejectValue: ServerResponseType<null> }
>(USER_THUNK_TYPES.UPDATE_USER_AS_ADMIN, async ({ userId, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(
      `${USER_API_ENDPOINTS.UPDATE_USER_AS_ADMIN}${userId}`,
      data,
      { withCredentials: true },
    );
    return response.data.data.user;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});
