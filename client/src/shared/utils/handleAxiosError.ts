import { AxiosError } from 'axios';
import { defaultAxiosError } from '../consts';
import type { ServerResponseType } from '../types';

function handleAxiosError(error: unknown): ServerResponseType<null> {
  if (error instanceof AxiosError) {
    if (error.code === 'ERR_NETWORK') {
      return {
        ...defaultAxiosError,
        error: 'Отсутствует соединение с сервером',
      };
    }
    if (error.code === 'ERR_CANCELED') {
      return {
        ...defaultAxiosError,
        error: 'Запрос отменен',
      };
    }
    if (error.response) {
      return error.response.data;
    }
  }

  return defaultAxiosError;
}

export default handleAxiosError;
