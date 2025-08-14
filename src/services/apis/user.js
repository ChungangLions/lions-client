import axios from "axios";
import { getAuthAxios } from "./authAxios";

const baseURL = 'http://13.125.150.49:8000';

export const login = async ( username, password) => {
    const response = await axios.post(`${baseURL}/auth/login`, {
        username,
        password,
    })
    console.log(response.data);
    return response.data;
}
