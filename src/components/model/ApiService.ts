import { FALLBACK_API_PRODUCTS } from "../../utils/constants";
import { IApiClient, IApiProduct, IApiCartItem, IApiOrder } from "../../types/api.types";

export class ApiService implements IApiClient {
    readonly cdnUrl: string;
    private readonly useFallback: boolean;

    constructor(cdnUrl: string, baseUrl: string, useFallback: boolean = false) {
        this.cdnUrl = cdnUrl;
        this.useFallback = useFallback;
    }
    baseUrl: string;
    removeFromCart(productId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    convertImagePath(imageUrl: string): string {
        if (!imageUrl) return '';
        return `${this.cdnUrl}${imageUrl.replace('.svg', '.png')}`;
    }

    async getProducts(): Promise<IApiProduct[]> {
        if (this.useFallback) {
            console.log('Используются резервные данные (сервер недоступен)');
            return FALLBACK_API_PRODUCTS.map(item => ({
                ...item,
                image: this.convertImagePath(item.image)
            }));
        }

        try {
            const response = await fetch(`${this.baseUrl}/product`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            return data.items.map((item: IApiProduct) => ({
                ...item,
                image: this.convertImagePath(item.image)
            }));
        } catch (error) {
            console.error('Ошибка при загрузке товаров', error);
            return FALLBACK_API_PRODUCTS.map(item => ({
                ...item,
                image: this.convertImagePath(item.image)
            }));
        }
    }

    async getProductById(id: string): Promise<IApiProduct> {
        const response = await fetch(`${this.baseUrl}/product/${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    }

    async addToCart(productId: string): Promise<IApiCartItem> {
        const response = await fetch(`${this.baseUrl}/cart`, {
            method: 'POST',
            body: JSON.stringify({ productId })
        });
        return response.json();
    }

    async createOrder(orderData: Omit<IApiOrder, 'id' | 'status'>): Promise<IApiOrder> {
        const response = await fetch(`${this.baseUrl}/order`, {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
        return response.json();
    }
}