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
