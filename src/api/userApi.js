const BASE_URL = 'http://13.125.150.49:8000';

export async function fetchUserList() {
    try {
      const response = await fetch(`${BASE_URL}/api/accounts/users/`);
      console.log(response);
      if (!response.ok) {
        throw new Error("서버 에러: " + response.status);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("유저 데이터 불러오기 에러:", err);
      return [];
    }
}

export async function fetchStudentList() {
  try {
    const response = await fetch(`${BASE_URL}/api/profiles/students/`);
    console.log(response);
    if (!response.ok) {
      throw new Error("서버 에러: " + response.status);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("유저 데이터 불러오기 에러:", err);
    return [];
  }
}

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
