const BASE_URL = 'http://13.125.150.49:8000';
const token = localStorage.getItem('access_token');

export async function fetchStudentProfile(id) {
    try {
      const response = await fetch(`${BASE_URL}/api/profiles/students/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      if (!response.ok) {
        throw new Error("서버 에러: " + response.status);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("학생 프로필 데이터 불러오기 에러:", err);
      return null;
    }
}