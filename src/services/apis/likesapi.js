import axios from "axios";
import { getAuthAxios } from "./authAxios";

const baseURL = `http://13.125.150.49:8000`;

export const togglelikes = async (userId) => {
    // 처음에 사용자 인증 위해서 access 토큰 가져오기 
    const token = localStorage.getItem("accessToken");
    const authAxios = getAuthAxios(token); 

    const response = await authAxios.post(`/api/accounts/users/${userId}/like-toggle`);
    return response.data;
};