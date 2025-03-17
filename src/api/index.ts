import axios from "axios";
import COS from "cos-js-sdk-v5";

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
    message: string;
    data: any;
}

export interface NewProductData {
    name: string;
    type: number | null;
    price: number | null;
    description: string;
    image: string | null;
    stock: number | null;
    turnstileToken: string;
    isUnlimited: boolean;
}

export interface GetProductData {
    page: number;
    row: number;
    type?: number;
    keyword?: string;
}

export interface ChangeProductData {
    id: number;
    isVerified: boolean;
    stock: number | null;
    sales: number;
    details: string;
}

export interface ChangeProductTypeData {
    id: number;
    type: string
}

export interface ChangeTradeData {
    id: number;
    status: string
}

export interface TradeDetailData {
    id: number
    buyerId: number
    sellerId: number
    buyerEmail: string
    sellerEmail: string
    productId: number
    count: number
    total: number
    status: "pending" | "completed" | "canceled"
}

export interface BuyProductData {
    id: number | null;
    count: number | null;
    turnstileToken: string;
}

export interface UserProfile {
    id: number
    username: string
    email: string
}

export interface ProductData {
    id: number;
    name: string;
    type: number;
    price: number;
    description: string;
    image: string | null;
    stock: number | null;
    sales: number;
    isVerified: boolean;
    isUnlimited: boolean;
    ownerId: number;
}

export interface ProductType {
    id: number;
    type: string;
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
    file: File
): Promise<{ success: boolean; data: any }> {
    const {
        credentials: {
            sessionToken: SecurityToken,
            tmpSecretId: TmpSecretId,
            tmpSecretKey: TmpSecretKey,
        },
        startTime: StartTime,
        expiredTime: ExpiredTime,
        key: key,
        bucket: bucket,
        region: region,
    } = (
        await axios.post<
            Response & {
                data: {
                    credentials: {
                        sessionToken: string;
                        tmpSecretId: string;
                        tmpSecretKey: string;
                    };
                    startTime: number;
                    expiredTime: number;
                    key: string;
                    bucket: string;
                    region: string;
                };
            }
        >("/api/cos/credential", { fileName: file.name })
    ).data.data;
    const cos = new COS({
        getAuthorization: async (_, callback) => {
            callback({
                SecurityToken,
                TmpSecretId,
                TmpSecretKey,
                StartTime,
                ExpiredTime,
            });
        },
    });
    return new Promise(async (resolve) => {
        cos.uploadFile(
            {
                Bucket: bucket,
                Region: region,
                Key: key,
                Body: await file.arrayBuffer(),
                ContentType: file.type,
            },
            (err) => {
                if (err) {
                    resolve({
                        success: false,
                        data: null,
                    });
                    console.log(err);
                } else {
                    resolve({
                        success: true,
                        data: key,
                    });
                }
            }
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

export async function postProducts(
    row: number,
    page: number,
    type: number | null,
    keyword: string | null
) {
    const data: GetProductData = { page, row };
    if (type) data.type = type;
    if (keyword) data.keyword = keyword;
    const response = await axios.post<{
        data: { products: ProductData[]; maxPage: number; page: number };
        success: boolean;
    }>("/api/product/get", data);
    return response.data;
}

export async function getVerifyAdmin() {
    const response = await axios.get<Response>("/api/user/verify_admin");
    return response.data;
}

export async function getAllProducts() {
    const response = await axios.get<{ data: ProductData[]; success: boolean }>(
        "/api/product/all"
    );
    return response.data;
}

export async function postChangeProduct(product: ChangeProductData) {
    const response = await axios.post<Response>("/api/product/change", product);
    return response.data;
}

export async function postCreateProductType(type: string) {
    const response = await axios.post<Response>("/api/product/types/new", {
        type,
    });
    return response.data;
}

export async function postRemoveProductType(id: number) {
    const response = await axios.post<Response>("/api/product/types/remove", {
        id,
    });
    return response.data;
}

export async function postProductDetail(id: number) {
    const response = await axios.post<Response>("/api/product/detail", { id });
    return response.data;
}

export async function postBuyProduct(data: BuyProductData) {
    const response = await axios.post<Response>("/api/product/buy", data);
    return response.data;
}

export async function postTradeDetail(id: number) {
    const response = await axios.post<Response>("/api/trade/detail", { id })
    return response.data
}

export async function postUserProfile(id: number) {
    const response = await axios.post<Response>("/api/user/profile", { id})
    return response.data
}

export async function postChangeProductType(data: ChangeProductTypeData) {
    const response = await axios.post<Response>("/api/product/types/change", data)
    return response.data
}

export async function postChangeTrade(data: ChangeTradeData) {
    const response = await axios.post<Response>("/api/trade/change", data)
    return response.data
}