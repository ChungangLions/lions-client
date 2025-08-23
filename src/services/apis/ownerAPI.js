import axios from "axios";
import { getAuthAxios } from "./authAxios";

export const getOwnerList = async() => {
    const token = localStorage.getItem("accessToken");
    const authAxios = getAuthAxios(token); 

    const response = await authAxios.get(`/api/profiles/owners/`);
    console.log(response.data);
    return response.data;
}

export const getOwnerProfile = async(ownerId) => {
    const token = localStorage.getItem("accessToken");
    const authAxios = getAuthAxios(token); 
    
    try {
        // 1. 전체 학생 프로필 목록 조회
        const listResp = await authAxios.get(`/api/profiles/owners/`);
        const profiles = listResp.data;

        console.log("프로필 리스트: ", profiles);

    
        // 2. 해당 userId의 프로필 리스트 필터
        const userProfiles = profiles.filter(profile => profile.user === Number(ownerId));
        console.log("프로필 리스트 필터링: ", userProfiles);
    
        if (userProfiles.length === 0) return null;
    
        // 3. id가 가장 큰 프로필 선택
        const latestProfile = userProfiles.reduce((a, b) => (a.id > b.id ? a : b));
    
        // 4. 최신 프로필 상세 정보 fetch (선택: 이미 목록에 모든 값 있으면 생략 가능)
        const detailResp = await authAxios.get(`/api/profiles/owners/${latestProfile.id}`);
        console.log(detailResp.data);

        return detailResp.data;
    
      } catch (err) {
        console.error("사장님 프로필 데이터 불러오기 에러:", err);
        return null;
      }
}

export const editOwnerProfile = async(id, data) => {
    const token = localStorage.getItem("accessToken");
    const authAxios = getAuthAxios(token); 

    const response = await authAxios.patch(`/api/profiles/owners/${id}/`, data);
    return response.data
    
}

export const getOwnerLikes = async(id) => {
    const token = localStorage.getItem("accessToken");
    const authAxios = getAuthAxios(token); 

    const response = await authAxios.get(`/api/accounts/users/${id}/likes-received-count`);
    console.log(response.data);
    return response.data;
}

export const getOwnerRecommends = async(id) => {
    const token = localStorage.getItem("accessToken");
    const authAxios = getAuthAxios(token); 

    const response = await authAxios.get(`/api/accounts/users/${id}/recommendations-received-count`);
    console.log(response.data);
    return response.data;
}

export const getOwnerPartnershipType = async(id, mode='send') => {
    const token = localStorage.getItem("accessToken");
    const authAxios = getAuthAxios(token); 

    const response = await authAxios.get(`/api/proposals/${mode}/${id}`);
    console.log(response.data);
    return response.data;
}