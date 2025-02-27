import axios from 'axios';

axios.defaults.baseURL = "http://127.0.0.1:8000";
axios.defaults.withCredentials = true

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
    turnstileToken: string
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

export async function postVerifyEmail(token: string) {
    const response = await axios.post<Response>('/api/user/verify_email', { token: token });
    return response.data
}

export async function postLogin(data: LoginData) {
    const response = await axios.post<Response>('/api/user/login', data);
    return response.data
}