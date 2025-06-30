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

export interface IApiClient {
    getProductsList: () => Promise<IProductsList>;
    getProduct: (id: string) => Promise<IProduct>;
    orderProducts: (order: IOrder) => Promise<ISuccessData>;
}
