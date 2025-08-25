import { getAuthAxios } from "./authAxios";

const BASE_URL = 'https://huniverse.p-e.kr';
const token = localStorage.getItem('access');

// 전체 학생 단체 프로필 
export async function fetchAllGroupProfile() {
    const token = localStorage.getItem("accessToken");
    const authAxios = getAuthAxios(token); 
    
    const response = await authAxios.get(`/api/profiles/student-groups/`);
    return response.data
}

// 특정 학생 단체 프로필
export const getGroupProfile = async(id) => {
    const token = localStorage.getItem("accessToken");
    const authAxios = getAuthAxios(token); 
    
    const response = await authAxios.get(`/api/profiles/student-groups/${id}/`);
    return response.data
}


// userId에 해당하는 유저의 최신 학생단체 프로필 데이터
export async function fetchGroupProfile(userId) {
  try {
    // 1. 전체 학생단체 프로필 목록 조회
    const token = localStorage.getItem("accessToken");
    const authAxios = getAuthAxios(token); 

    const listResp = await authAxios.get(`/api/profiles/student-groups/`);
    const profiles = listResp.data;

    // 2. 해당 userId의 프로필 리스트 필터
    const userProfiles = profiles.filter(profile => profile.user === userId);

    if (userProfiles.length === 0) return null;

    // 3. id가 가장 큰 프로필 선택
    const latestProfile = userProfiles.reduce((a, b) => (a.id > b.id ? a : b));

    // 4. 최신 프로필 상세 정보 fetch (선택: 이미 목록에 모든 값 있으면 생략 가능)
    const detailResp = await authAxios.get(`/api/profiles/student-groups/${latestProfile.id}`);
   
    return detailResp.data;

  } catch (err) {
    console.error("학생 프로필 데이터 불러오기 에러:", err);
    return null;
  }
}

export function mappedOrg(user, idx) {
    const safeToStringCount = (val) => {
      if (typeof val === "number") return `${val.toLocaleString()}명`;
      if (typeof val === "string" && val.trim() !== "") return val;
      return "0명";
    };

    // // 시작일과 종료일 Date 객체로 변환 (있을 때만)
    // const startDate = user?.partnership_start ? new Date(user.partnership_start) : null;
    // const endDate = user?.partnership_end ? new Date(user.partnership_end) : null;

    // // // 개월 수 계산 (startDate와 endDate가 모두 있을 때만)
    // const period = startDate && endDate
    //   ? (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    //     (endDate.getMonth() - startDate.getMonth()) + 1
    //   : null;


    // user 필드가 객체로 오면 id만 추출
    const userId = typeof user?.user === 'object' && user?.user !== null
      ? user.user.id
      : user?.user ?? idx;

    return {
      id: user?.id ?? idx,
      user: userId,
      university_name: user?.university_name || "",
      department: user?.department || "",
      council_name: user?.council_name || "",
      position: user?.position || "",
      student_size: safeToStringCount(user?.student_size),
      is_liked: user?.is_liked ?? false, // 찜 저장용
      partnership_start: user?.partnership_start ? user.partnership_start.slice(0, 10) : (user?.created_at?.slice(0, 7) || ""),
      partnership_end: user?.partnership_end ? user.partnership_end.slice(0, 10) : (user?.modified_at?.slice(0, 7) || ""),
      term_start : user?.term_start,
      term_end : user?.term_end,
      record: user?.partnership_count ?? 0, // 제휴 이력 추가
      photos: user?.photos?.map(photo => photo.image) // url 배열
    };
}

export const editGroupProfile = async(id, data) => {
    const token = localStorage.getItem("accessToken");
    const authAxios = getAuthAxios(token); 

    const response = await authAxios.patch(`/api/profiles/student-groups/${id}/`, data);
    return response.data
    
}

export const getGroupLikes = async(id) => {
  const token = localStorage.getItem("accessToken");
  const authAxios = getAuthAxios(token); 

  const response = await authAxios.get(`/api/accounts/users/${id}/likes-received-count`);
  console.log(response.data);
  return response.data;
}


export const getGroupPartnership = async(id, mode='send') => {
  const token = localStorage.getItem("accessToken");
  const authAxios = getAuthAxios(token); 

  const response = await authAxios.get(`/api/proposals/${mode}/${id}`);
  console.log(response.data);
  return response.data;
}