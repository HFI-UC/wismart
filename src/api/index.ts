import axios from 'axios';

axios.defaults.baseURL = "https://wismart-api.hfiuc.org";
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
    message?: string;
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

export async function postLogout() {
    const response = await axios.post<Response>('/api/user/logout');
    return response.data
}

export async function postVerifyLogin() {
    const response = await axios.post<Response>('/api/user/verify_login')
    return response.data
}