import type { AxiosError } from 'axios';
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

let accessToken = '';

type ExtendedAxiosRequestConfig = {
  sent?: boolean;
} & InternalAxiosRequestConfig;

export function setAccessToken(newAccessToken: string): void {
  accessToken = newAccessToken;
}

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (accessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError) => {
    const previousRequest: ExtendedAxiosRequestConfig | undefined = error.config;

    if (error.response?.status === 403 && previousRequest && !previousRequest.sent) {
      previousRequest.sent = true;
      try {
        // refresh endpoint on the server is /users/refreshTokens (see server/routes/userRouter.js)
        const { data } = await axiosInstance.get('/users/refreshTokens');
        const newToken = data.data.accessToken;
        setAccessToken(newToken);
        previousRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(previousRequest);
      } catch (error) {
        setAccessToken('');
        // redirect to the application's login page (route is /login)
        // previously redirected to '/auth' which doesn't exist -> NotFound / 404
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);
