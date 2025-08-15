const BASE_URL = 'http://13.125.150.49:8000';
const token = localStorage.getItem('access_token');

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