import { getAuthAxios } from "./authAxios";

export const togglelikes = async (targetId) => {
    // 처음에 사용자 인증 위해서 access 토큰 가져오기 
    const token = localStorage.getItem("accessToken");
    const authAxios = getAuthAxios(token); 

     if (!targetId) throw new Error("userId가 필요합니다."); // 오류 확인용

    console.log("찜 토글 API 호출:", targetId);

    try {
        const response = await authAxios.post(
            `/api/accounts/users/${targetId}/like-toggle/`, {}
        );
        console.log("찜 토글 API 응답:", response.data);
        return response.data;
    } catch (error) {
        console.error("찜하기 토글 실패:", error);
        console.error("에러 상세:", error.response?.data);
        throw error; // 상위 컴포넌트에 에러 전달
    }
};


// 현재 사용자가 찜한 항목들 가져오기
export const fetchUserLikes = async () => {
    const token = localStorage.getItem("accessToken");
    const authAxios = getAuthAxios(token); 

    console.log("찜 목록 조회 API 호출");

    try {
        const response = await authAxios.get(`/api/accounts/likes/`);
        console.log("찜 목록 조회 응답:", response.data);
        return response.data;
    } catch (error) {
        console.error("찜 목록 조회 실패:", error);
        console.error("에러 상세:", error.response?.data);
        return [];
    }
};

export async function fetchLikes(mode='received') {
  const authAxios = getAuthAxios(localStorage.getItem('accessToken'));
  const API_URL = `/api/accounts/likes?mode=${mode}`;
  try {
    const response = await authAxios.get(API_URL);
    const data = response.data;
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('[추천 API] fetchLikes 에러', err);
    return [];
  }
}

