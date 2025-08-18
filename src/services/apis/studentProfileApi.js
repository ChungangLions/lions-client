const BASE_URL = 'http://13.125.150.49:8000';
const token = localStorage.getItem('access');

export async function fetchStudentProfile(userId) {
  try {
    // 1. 전체 학생 프로필 목록 조회
    const listResp = await fetch(`${BASE_URL}/api/profiles/students/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (!listResp.ok) throw new Error("학생 프로필 목록 에러: " + listResp.status);
    const profiles = await listResp.json();

    // 2. 해당 userId의 프로필 리스트 필터
    const userProfiles = profiles.filter(profile => profile.user === userId);

    if (userProfiles.length === 0) return null;

    // 3. id가 가장 큰 프로필 선택
    const latestProfile = userProfiles.reduce((a, b) => (a.id > b.id ? a : b));

    // 4. 최신 프로필 상세 정보 fetch (선택: 이미 목록에 모든 값 있으면 생략 가능)
    const detailResp = await fetch(`${BASE_URL}/api/profiles/students/${latestProfile.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    if (!detailResp.ok) throw new Error("상세 학생 프로필 에러: " + detailResp.status);
    const data = await detailResp.json();
    console.log(data);
    return data;

  } catch (err) {
    console.error("학생 프로필 데이터 불러오기 에러:", err);
    return null;
  }
}

export async function patchStudentProfile(profileId, formData) {
  const response = await fetch(`${BASE_URL}/api/profiles/students/${profileId}/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData
  });
  if (!response.ok) {
    const msg = await response.text();
    throw new Error(`PATCH Error ${response.status}: ${msg}`);
  }
  return await response.json();
}

export async function postStudentProfile(createData) {
  const response = await fetch(`${BASE_URL}/api/profiles/students/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(createData),
  });
  if (!response.ok) throw new Error("프로필 생성 에러: " + response.status);
  return await response.json();
}

export async function fetchRecommendations() {
  const res = await fetch(`${BASE_URL}/api/accounts/recommendations/`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!res.ok) throw new Error("추천 목록 조회 에러: " + res.status);
  return res.json();
}

export async function fetchOwnerProfiles() {
  const res = await fetch(`${BASE_URL}/api/profiles/owners/`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!res.ok) throw new Error("가게게 목록 조회 에러: " + res.status);
  return res.json();
}
