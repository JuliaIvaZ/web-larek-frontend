import { IOrder, IProduct, IProductsList, ISuccessData } from "../../types/app.types";
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

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getProduct(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`).then(
            (item: IProduct) => ({
                ...item,
                image: this.cdn + item.imageUrl,
            })
        );
    }
    

    getProductsList(): Promise<IProductsList> {
    return this.get('/product/')
        .then((data: ApiListResponse<IProduct>) => {
            const modifiedItems = data.items.map((item) => ({
                ...item,
                image: this.cdn + item.imageUrl
            }));
            return {
                _items: modifiedItems,
                total: data.total // если есть total в ответе
            } as IProductsList;
        });
}

    orderProducts(order: IOrder): Promise<ISuccessData> {
        return this.post('/order', order).then(
            (data: ISuccessData) => data
        );
    }
}