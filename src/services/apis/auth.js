import axios from "axios";


export const login = async (username, password) => {
  const response = await axios.post('/auth/login', { username, password });
  return response.data;
};

export const getNewRefreshToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  const response = await axios.post('/auth/refresh', { refresh: refreshToken });
  return response.data;
};
