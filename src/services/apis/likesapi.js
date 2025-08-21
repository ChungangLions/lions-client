import { getAuthAxios } from "./authAxios";

export async function fetchLikes(mode='received') {
  const authAxios = getAuthAxios(localStorage.getItem('accessToken'));
  const API_URL = `/api/accounts/likes?mode=${mode}`;
  try {
    const response = await authAxios.get(API_URL);
    const data = response.data;
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('찜 API 에러', err);
    return [];
  }
}

export async function toggleLikes(userId) {
  const authAxios = getAuthAxios(localStorage.getItem('accessToken'));
  if (!userId) throw new Error('userId가 필요합니다.');
  const response = await authAxios.post(`/api/accounts/users/${userId}/like-toggle/`);
  return response.data;
}