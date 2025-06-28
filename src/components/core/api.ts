import { API_URL, FALLBACK_API_PRODUCTS } from "../../utils/constants";
import { IApiCartItem, IApiClient, IApiOrder, IApiProduct } from "../../types/api.types";

export type ApiListResponse<Product> = {
    total: number,
    items: Product[]
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string = API_URL, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }

    protected handleResponse(response: Response): Promise<object> {
        if (response.ok) return response.json();
        else return response.json()
            .then(data => Promise.reject(data.error ?? response.statusText));
    }

    get(uri: string) {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET'
        }).then(this.handleResponse);
    }

    post(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }).then(this.handleResponse);
    }
};

export class ApiClient implements IApiClient {
    readonly cdnUrl: string;
    readonly baseUrl: string;
    private useFallback: boolean;

    constructor(cdnUrl: string, baseUrl: string, useFallback: boolean = false) {
        this.cdnUrl = cdnUrl;
        this.baseUrl = baseUrl;
        this.useFallback = useFallback;
    }
    removeFromCart(productId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async getProducts(): Promise<IApiProduct[]> {
        if (this.useFallback) {
            console.log('Используются резервные данные');
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
            console.error('Ошибка загрузки товаров:', error);
            return FALLBACK_API_PRODUCTS.map(item => ({
                ...item,
                image: this.convertImagePath(item.image)
            }));
        }
    }

    convertImagePath(imageUrl: string): string {
        return imageUrl ? `${this.cdnUrl}${imageUrl.replace('.svg', '.png')}` : '';
    }

    // Остальные обязательные методы интерфейса
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
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        return response.json();
    }
}