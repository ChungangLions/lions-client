import axios from "axios";
import { getNewRefreshToken } from "./auth";

const baseURL = 'http://13.125.150.49:8000';

export const getAuthAxios = (token) => {
  const authAxios = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  authAxios.interceptors.response.use(
    (response) => response, // 응답이 잘 왔으면 받은 응답을 반환
    async (error) => {
      // 에러가 발생했을 때 아래 코드들을 실행
      const result = await getNewRefreshToken();
      error.config.headers.Authorization = `Bearer ${result.access}`;
      // 오류가 발생한 요청을 했을 때, 헤더에 담아서 보낸 토큰을 새 토큰으로 변경
      localStorage.setItem("accessToken", result.access);
      localStorage.setItem("refreshToken", result.refresh);
      return (await axios(error.config.url, error.config));
      //에러가 발생한 요청의 url을 그대로 가져와서 사용하고, 필요한 데이터들은
      //error.config 객체 내에 담겨있기 때문에 그대로 다시 가져와서 get 요청
    }
  );
  return authAxios;
};
