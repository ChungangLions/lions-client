
import { getAuthAxios } from "./authAxios";


export const togglelikes = async (targetId) => {
    // 처음에 사용자 인증 위해서 access 토큰 가져오기 
    const token = localStorage.getItem("accessToken");
    const authAxios = getAuthAxios(token); 

     if (!targetId) throw new Error("userId가 필요합니다."); // 오류 확인용

    try {
        const response = await authAxios.post(
            `/api/accounts/users/${targetId}/like-toggle/`, {}
        );
        return response.data;
    } catch (error) {
        console.error("찜하기 토글 실패:", error);
        throw error; // 상위 컴포넌트에 에러 전달
    }
};