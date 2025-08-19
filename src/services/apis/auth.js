import axios from "axios";

const baseURL = `https://huniverse.p-e.kr`;

export const login = async ( username, password) => {
  const response = await axios.post(`${baseURL}/auth/login/`, { username, password });
  console.log(response.data);
  return response.data;
};

export const getNewRefreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const response = await axios.post(`${baseURL}/auth/refresh/`, { refresh: refreshToken });
  return response.data;
};
