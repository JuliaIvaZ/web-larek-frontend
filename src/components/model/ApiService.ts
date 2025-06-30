import { IApiProduct } from "../../types/api.types";
import { IOrder, IProduct, IProductsList, ISuccessData, ProductCategory } from "../../types/app.types";
import { FALLBACK_API_PRODUCTS } from "../../utils/constants";
import { Api, ApiListResponse } from "../core/api";

// Приведено
export interface IApiService {
    getProductsList: () => Promise<IProductsList>;
    getProduct: (id: string) => Promise<IProduct>;
    orderProducts: (order: IOrder) => Promise<ISuccessData>;
}

// Приведено
export class ApiService extends Api implements IApiService {
    readonly cdn: string;
    private readonly useFallback: boolean;

    constructor(cdn: string, baseUrl: string, useFallback: boolean = false, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
        this.useFallback = useFallback;
    }

    getProduct(id: string): Promise<IProduct> {
        return this.get(`/items/${id}`).then(
            (item: IProduct) => ({
                ...item,
                image: this.cdn + item.imageUrl,
            })
        );
    }

    convertImagePath(imageUrl: string): string {
        if (!imageUrl) return '';
        return `${this.cdn}${imageUrl.replace('.svg', '.png')}`;
    }

    async getProductsList(): Promise<IProductsList> {
        let items: IProduct[] = [];
        
        if (this.useFallback) {
            console.log('Используются резервные данные (сервер недоступен)');
            items = FALLBACK_API_PRODUCTS.map(item => ({
                id: item.id,
                title: item.title,
                description: item.description,
                imageUrl: this.convertImagePath(item.image),
                category: item.category as ProductCategory,
                price: item.price
            }));
        } else {
            try {
                const response = await fetch(`${this.baseUrl}/product`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                items = data.items.map((item: IApiProduct) => ({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    imageUrl: this.convertImagePath(item.image),
                    category: item.category as ProductCategory,
                    price: item.price
                }));
                
            } catch (error) {
                console.error('Ошибка при загрузке товаров', error);
                console.warn('Переключение на резервные данные');
                items = FALLBACK_API_PRODUCTS.map(item => ({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    imageUrl: this.convertImagePath(item.image),
                    category: item.category as ProductCategory,
                    price: item.price
                }));
            }
        }
        return {
            _items: items,  // Используем правильное имя поля согласно интерфейсу
            total: items.length
        } as IProductsList;
    }

    orderProducts(order: IOrder): Promise<ISuccessData> {
        return this.post('/order', order).then(
            (data: ISuccessData) => data
        );
    }
}