import { IApiCartItem, IApiOrder, IApiProduct, IApiClient } from '../types/api_types';
import { Api } from './base/api';
import { API_URL, CDN_URL } from '../utils/constants';

export class ApiClient extends Api implements IApiClient {
    readonly cdn = CDN_URL;

    constructor(cdn: string = CDN_URL, baseUrl: string = API_URL, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }
    cdnUrl: string;
    convertImagePath(imageUrl: string): string {
        throw new Error('Method not implemented.');
    }

    getProducts(): Promise<IApiProduct[]> {
        return this.get('/items')
        .then ((res: {item: IApiProduct[]}) => {
            return res.item.map(item => ({
                ...item,
                image: `${this.cdn}/${item.image}`
            }))
        });
    }

    getProductById(id: string): Promise<IApiProduct> {
        return this.get(`/items/${id}`)
        .then ((res) => res as IApiProduct);
    }

    addToCart(productId: string): Promise<IApiCartItem> {
        throw new Error('Method not implemented.');
    }

    removeFromCart(productId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    
    createOrder(orderData: Omit<IApiOrder, 'id' | 'status'>): Promise<IApiOrder> {
        throw new Error('Method not implemented.');
    }
}
