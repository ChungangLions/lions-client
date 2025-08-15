import axios from "axios";

const baseURL = `http://13.125.150.49:8000`;

export const login = async ( email, username, password) => {
  const response = await axios.post(`${baseURL}/auth/login/`, { email, username, password });
  console.log(response.data);
  return response.data;
};

export const getNewRefreshToken = async () => {
  const refreshToken = localStorage.getItem('refresh');
  const response = await axios.post(`${baseURL}/auth/refresh/`, { refresh: refreshToken });
  return response.data;
};
