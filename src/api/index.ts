import axios from 'axios';

axios.defaults.baseURL = "http://localhost:8000";

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    turnstileToken: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface Response {
    success: boolean;
    message: string;
    data?: any;
}

export async function postRegister(data: RegisterData) {
  const response = await axios.post<Response>('/api/user/register', data);
  return response.data;
}

export async function postVerify(token: string) {
    const response = await axios.post<Response>('/api/user/verify', { token: token });
    return response.data
}

export async function postLogin(data: LoginData) {
    const response = await axios.post<Response>('/api/user/login', data);
    return response.data
}