import { getAuthAxios } from "./authAxios";

export const getAIDraftProposal = async(recipient, contact_info) => {
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
export async function createProposal(createData) {
  const authAxios = getAuthAxios(localStorage.getItem('accessToken'));
  const res = await authAxios.post(`/api/proposals/`, createData);
  return res.data;
}

