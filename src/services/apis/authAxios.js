import axios from "axios";
import { getNewRefreshToken } from "./auth";

const baseURL = 'https://huniverse.p-e.kr';

export const getAuthAxios = (initialToken) => {
  const authAxios = axios.create({
    baseURL,
    
  });

  // 매 요청마다 최신 토큰을 로컬스토리지에서 읽어와서 Authorization 헤더를 세팅
  authAxios.interceptors.request.use((config) => {
    const latestToken = localStorage.getItem('accessToken') || initialToken;
    if (!config.headers) config.headers = {};
    if (latestToken) {
      config.headers.Authorization = `Bearer ${latestToken}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  });

  authAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config || {};

      // 401에 대해서만 갱신 시도, 무한 루프 방지
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const result = await getNewRefreshToken();
          const newAccess = result.access || result.accessToken;
          const newRefresh = result.refresh || result.refreshToken;

          if (newAccess) {
            localStorage.setItem('accessToken', newAccess);
          }
          if (newRefresh) {
            localStorage.setItem('refreshToken', newRefresh);
          }

          // 갱신된 토큰으로 원 요청 재시도
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
          return axios(originalRequest);
        } catch (refreshError) {
          // 갱신 실패 시 토큰 정리
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return authAxios;
};