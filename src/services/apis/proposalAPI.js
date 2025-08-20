import { getAuthAxios } from "./authAxios";

export const getAIDraftProposal = async(recipient, contact_info) => {
    const token = localStorage.getItem("accessToken");
    const authAxios = getAuthAxios(token); 

    const response = await authAxios.post(`/api/proposals/ai-draft/`, {recipient, contact_info});
    return response.data
    
}


