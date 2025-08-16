import axios from "axios";
import { getAuthAxios } from "./authAxios";

export const getOwnerProfile = async(id) => {
    const token = localStorage.getItem("accessToken");
    const authAxios = getAuthAxios(token); 

    const response = await authAxios.get(`/api/profiles/owners/${id}/`);
    return response.data
}

export const editOwnerProfile = async(id, data) => {
    const token = localStorage.getItem("accessToken");
    const authAxios = getAuthAxios(token); 

    const response = await authAxios.patch(`/api/profiles/owners/${id}/`, data);
    return response.data
    
}