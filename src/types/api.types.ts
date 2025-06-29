import { IOrder, IProduct, IProductsList, ISuccessData } from "./app.types";

// Типы данных API
export interface IApiProduct {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number | null;
}

export interface IApiCartItem {
    productId: string;
    priceSnapshot: number;
}

export interface IApiOrder {
    id: string;
    items: string[];
    total: number;
    address: string;
    payment: string;
    email: string;
    phone: string;
    status: string;
}

export interface IApiSuccess {
    id: string;
    total: number;
}

//export interface IApiClient {
//    readonly cdnUrl: string;
//    readonly baseUrl: string;
//    convertImagePath(imageUrl: string): string;
//    getProducts(): Promise<IApiProduct[]>;
//    getProductById(id: string): Promise<IApiProduct>;
//    createOrder(orderData: Omit<IApiOrder, 'id' | 'status'>): Promise<IApiOrder>;
//}
// ПЕРЕРАБОТАННЫЙ ИНТЕРФЕЙС:
export interface IApiClient {
    getProductsList: () => Promise<IProductsList>;
    getProduct: (id: string) => Promise<IProduct>;
    orderProducts: (order: IOrder) => Promise<ISuccessData>;
}

export interface IApiProductList {
    total: number;
    items: IApiProduct[];
}