const BASE_URL = 'http://13.125.150.49:8000';
const token = localStorage.getItem('access');

export async function fetchRecommendations({} = {}) {
    const API_URL = `${BASE_URL}/api/accounts/accounts/recommendations?mode=received`;
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('[추천 API] fetchRecommendations 에러', err);
      return [];
    }
}

export async function toggleRecommends(userId) {
  console.log('userId:', userId); // 추가 확인
  const response = await fetch(`${BASE_URL}/api/accounts/users/${userId}/recommend-toggle/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  });
  
  if (!response.ok) {
    throw new Error(`API 오류: ${response.status}`);
  }
  
  const result = await response.json();
  return result;
}