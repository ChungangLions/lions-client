
import { getAuthAxios } from "./authAxios";

const baseURL = `https://huniverse.p-e.kr/`;

export const togglelikes = async (userId) => {
    // 처음에 사용자 인증 위해서 access 토큰 가져오기 
    const authAxios = getAuthAxios(localStorage.getItem('accessToken'));

     if (!userId) throw new Error("userId가 필요합니다."); // 오류 확인용

    const response = await authAxios.post(`/api/accounts/users/${userId}/like-toggle`, {});
    return response.data;
};