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

// export const название санки = createAsyncThunk<тип возвращаемого значения, тип принимаемых аргументов, тип rejectValue - что вернет при ошибке >(название из enum USER_THUNK_TYPES, async (аргументы, { rejectWithValue }) => {})

export const refreshTokensThunk = createAsyncThunk<
  UserType,
  void,
  { rejectValue: ServerResponseType<null> }
>(USER_THUNK_TYPES.REFRESH, async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ServerResponseType<UserResponseType>>(
      USER_API_ENDPOINTS.REFRESH,
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
    return response.data.data.user; //  при успешном выполнении санка передаст пользователя в reducer в action.payload
  } catch (error) {
    // обработка кастомной ошибки через утилиту handleAxiosError (опционально, описана в shared/utils/handleAxiosError.ts)
    return rejectWithValue(handleAxiosError(error));
  }
});
