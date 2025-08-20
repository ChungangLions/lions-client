import { getAuthAxios } from "./authAxios";

export async function fetchStudentProfile(userId) {
  const authAxios = getAuthAxios(localStorage.getItem('accessToken'));
  try {
    // 1. 전체 학생 프로필 목록 조회
    const listResp = await authAxios.get(`/api/profiles/students/`);
    const profiles = listResp.data;

    // 2. 해당 userId의 프로필 리스트 필터
    const userProfiles = profiles.filter(profile => profile.user === userId);

    if (userProfiles.length === 0) return null;

    // 3. id가 가장 큰 프로필 선택
    const latestProfile = userProfiles.reduce((a, b) => (a.id > b.id ? a : b));

    // 4. 최신 프로필 상세 정보 fetch (선택: 이미 목록에 모든 값 있으면 생략 가능)
    const detailResp = await authAxios.get(`/api/profiles/students/${latestProfile.id}`);
    return detailResp.data;

  } catch (err) {
    console.error("학생 프로필 데이터 불러오기 에러:", err);
    return null;
  }
}

export async function patchStudentProfile(profileId, formData) {
  const authAxios = getAuthAxios(localStorage.getItem('accessToken'));
  const res = await authAxios.patch(`/api/profiles/students/${profileId}/`, formData);
  return res.data;
}

export async function postStudentProfile(createData) {
  const authAxios = getAuthAxios(localStorage.getItem('accessToken'));
  const res = await authAxios.post(`/api/profiles/students/`, createData);
  return res.data;
}

export async function fetchRecommendations() {
  const authAxios = getAuthAxios(localStorage.getItem('accessToken'));
  const res = await authAxios.get(`/api/accounts/recommendations/`);
  return res.data;
}

export async function fetchOwnerProfiles() {
  const authAxios = getAuthAxios(localStorage.getItem('accessToken'));
  const res = await authAxios.get(`/api/profiles/owners/`);
  return res.data;
}
