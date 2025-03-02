import axios from "axios";
import COS, { type Credentials } from "cos-js-sdk-v5";

axios.defaults.baseURL = "https://wismart-api.hfiuc.org";
axios.defaults.withCredentials = true;

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
    turnstileToken: string;
}

export interface Response {
    success: boolean;
    message?: string;
    data?: any;
}

export interface NewProductData {
    name: string
    type: string
    price: number | null
    description: string
    image: string
    stock: number | null
    turnstileToken: string
}

export async function postRegister(data: RegisterData) {
    const response = await axios.post<Response>("/api/user/register", data);
    return response.data;
}

export async function postVerifyEmail(token: string) {
    const response = await axios.post<Response>("/api/user/verify_email", {
        token,
    });
    return response.data;
}

export async function postLogin(data: LoginData) {
    const response = await axios.post<Response>("/api/user/login", data);
    return response.data;
}

export async function getLogout() {
    const response = await axios.get<Response>("/api/user/logout");
    return response.data;
}

export async function getVerifyLogin() {
    const response = await axios.get<Response>("/api/user/verify_login");
    return response.data;
}

export async function uploadCOS(
    file: File,
): Promise<{ success: boolean; data: any }> {
    const key = ""
    const cos = new COS({
        getAuthorization: async (_, callback) => {
            const { SessionToken: SecurityToken, Key: key, ...rest } = (
                await axios.post<{
                    credentials: { SessionToken: string, Key: string } & Credentials;
                }>("/api/cos/credential", { fileName: file.name })
            ).data.credentials;

            callback({ SecurityToken, ...rest });
        },
    });
    return new Promise(async (resolve) => {
        cos.uploadFile(
            {
                Bucket: "repair-1304562386",
                Region: "ap-guangzhou",
                Key: key,
                Body: await file.arrayBuffer(),
            },
            (err) => {
                if (err) {
                    resolve({
                        success: false,
                        data: null
                    });
                } else {
                    resolve({
                        success: true,
                        data: key
                    });
                }
            },
        );
    });
}

export async function postNewProduct(data: NewProductData) {
    const response = await axios.post<Response>("/api/product/new", data);
    return response.data;
}

export async function getProductTypes() {
    const response = await axios.get<Response>("/api/product/types");
    return response.data;
}