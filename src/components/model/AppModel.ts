import { EventEmitter } from '../core/EventEmitter';
import { IProduct, ProductCategory } from '../../types/app.types';
import { IApiClient, IApiProduct } from '../../types/api.types';
import { FALLBACK_API_PRODUCTS } from '../../utils/constants';

export class CartModel {
    private items: IProduct[] = [];
    private events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }

    addItem(item: IProduct): void {
        if (!this.hasItem(item.id)) {
            this.items.push(item);
            this.emitUpdate();
        }
    }

    removeItem(id: string): void {
        this.items = this.items.filter(item => item.id !== id);
        this.emitUpdate();
    }

    hasItem(id: string): boolean {
        return this.items.some(item => item.id === id);
    }

    private emitUpdate(): void {
        this.events.emit('cart:updated', { 
            items: [...this.items] 
        });
    }

    getItems(): IProduct[] {
        return [...this.items];
    }
}

export class ProductModel {
    private products: IProduct[] = [];
    private dataSource: 'server' | 'fallback' = 'server';

    constructor(private apiClient: IApiClient) {}

    async loadProducts(): Promise<void> {
        try {
            const apiProducts = await this.apiClient.getProducts();
            this.dataSource = apiProducts === FALLBACK_API_PRODUCTS ? 'fallback' : 'server';
            this.products = apiProducts.map(this.convertToProduct);
            console.log(`Загружено ${this.products.length} товаров`);
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
            throw error;
        }
    }

    private convertToProduct(apiProduct: IApiProduct): IProduct {
        return {
            id: apiProduct.id,
            title: apiProduct.title,
            description: apiProduct.description,
            imageUrl: apiProduct.image,
            category: apiProduct.category as ProductCategory,
            price: apiProduct.price
        };
    }

    getProducts(): IProduct[] {
        return [...this.products];
    }
}