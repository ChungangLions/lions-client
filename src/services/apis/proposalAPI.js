import { getAuthAxios } from "./authAxios";

export const getAIDraftProposal = async(recipient, contact_info) => {
    const token = localStorage.getItem("accessToken");
    const authAxios = getAuthAxios(token); 

    const requestData = {
        recipient: recipient,
        contact_info: contact_info
    };

    const response = await authAxios.post(`/api/proposals/ai-draft-to-student/`, JSON.stringify(requestData), {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return response.data
    
}

export const getAutoAIDraftProposal = async(recipient, contact_info) => {
    const token = localStorage.getItem("accessToken");
    const authAxios = getAuthAxios(token); 

    const requestData = {
        recipient: recipient,
        contact_info: contact_info
    };

    const response = await authAxios.post(`/api/proposals/ai-draft/`, JSON.stringify(requestData), {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return response.data
    
}

// 제안서 생성 (전송 또는 저장 누를 시)
export default async function createProposal(createData) {
  const authAxios = getAuthAxios(localStorage.getItem('accessToken'));
  const res = await authAxios.post(`/api/proposals/`, createData);
  return res.data;
}

// 제안서 부분 수정
export const editProposal = async (id, data) => {
    const token = localStorage.getItem("accessToken");
    const authAxios = getAuthAxios(token);
    const response = await authAxios.patch(`/api/proposals/${id}/`, data);
    return response.data;
};

// 제안서 조회
export const fetchProposal = async (params = {}) => {
  try {
    const token = localStorage.getItem("accessToken");
    const authAxios = getAuthAxios(token);
    const response = await authAxios.get("/api/proposals/", {
      params: {
        search: params.search || undefined,
        ordering: params.ordering || "-created_at", // 최신순 기본
        box: params.box || "all",
        status: params.status || undefined,
        date_from: params.date_from || undefined,
        date_to: params.date_to || undefined,
      },
    });
    return response.data; // 제안서 데이터
  } catch (error) {
    console.error("제안서 조회 실패:", error);
    throw error;
  }
};

// // 제안서 상태 변경 (승낙 / 거절 누를 시)
// export default async function editProposalStatus(id, statusData) { // 여기서 Id는 제안서 id
//   const authAxios = getAuthAxios(localStorage.getItem('accessToken'));
//   const res = await authAxios.post(`/api/proposals/${id}/status/`, statusData);
//   return res.data;
// }