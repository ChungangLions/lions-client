import { getAuthAxios } from "./authAxios";

export async function fetchRecommendations(mode='received') {
  const authAxios = getAuthAxios(localStorage.getItem('accessToken'));
  const API_URL = `/api/accounts/recommendations?mode=${mode}`;
  try {
    const response = await authAxios.get(API_URL);
    const data = response.data;
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('[추천 API] fetchRecommendations 에러', err);
    return [];
  }
}

export async function toggleRecommends(userId) {
  const authAxios = getAuthAxios(localStorage.getItem('accessToken'));
  if (!userId) throw new Error('userId가 필요합니다.');
  const response = await authAxios.post(`/api/accounts/users/${userId}/recommend-toggle/`);
  return response.data;
}