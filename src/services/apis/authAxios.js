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

// export const getAuthAxios = (token) => {
//   const authAxios = axios.create({
//     baseURL,
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   authAxios.interceptors.response.use(
//     (response) => response, // 응답이 잘 왔으면 받은 응답을 반환
//     async (error) => {
//       // 에러가 발생했을 때 아래 코드들을 실행
//       const result = await getNewRefreshToken();
//       error.config.headers.Authorization = `Bearer ${result.accessToken}`;
//       // 오류가 발생한 요청을 했을 때, 헤더에 담아서 보낸 토큰을 새 토큰으로 변경
//       localStorage.setItem("accessToken", result.accessToken);
//       localStorage.setItem("refreshToken", result.refreshToken);

//       console.log('localStorage accessToken:', localStorage.getItem('accessToken')); // 바로 확인!

//       return (await axios(error.config));
//       //에러가 발생한 요청의 url을 그대로 가져와서 사용하고, 필요한 데이터들은
//       //error.config 객체 내에 담겨있기 때문에 그대로 다시 가져와서 get 요청
//     }
//   );
//   return authAxios;
// };