// Типы данных приложения (внутренние типы приложения)

import { FALLBACK_API_PRODUCTS } from "../utils/constants";
import { IApiClient, IApiProduct } from "./api_types";

// Категории товаров
export type ProductCategory = 'софт-скил' | 'хард-скил' | 'дополнительное' | 'кнопка' | 'другое';

// Товар в приложении
interface IProduct {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    category: ProductCategory;
    price: number | null;
}

// Элемент корзины
interface ICartItem {
    product: IProduct;
    totalPrice: number;
}

// Состояние корзины
interface ICartData {
    items: ICartItem[];
    totalPrice: number;
}

// Способы оплаты
type PaymentMethod = 'online' | 'then';

// Контакты покупателя. Так как поля обязательные, 
// валидация проверяется в OrderModel
interface ICustomerContacts {
    email: string;
    phone: string;
}

//Оформленный заказ. Создается в OrderModel при оформлении,
// отправляется на сервер (преобразуется в ApiOrder),
// получаем обратно с сервера id и  status????
interface IOrder {
    id: string;
    item: ICartItem[];
    paymentMethod: PaymentMethod;
    customerContacts: ICustomerContacts;
    total: number;
    status: string;
}

// Интерфейсы моделей

// Модель товаров
// управляет данными о товарах: загрузкой, поиском, текущим выбранным товаром
interface IProductModel {
    getProducts(): IProduct[];                           // возвращает массив уже загруженных и преобразованных в 
                                                        // Product товаров при открытии главной страницы, при успешной загрузке данных с сервера
    getProductById(id: string): IProduct | undefined;    // возвращает товар по его ID
    setCurrentProduct(id: string): void;                // устанавливает текущий выбранный товар (например, для отображения
                                                        // в модальном окне)
    setProducts(products: IProduct[]): void;              // устанавливает массив товаров
}

export class ProductModel implements IProductModel {
    private products: IProduct[] = [];
    private currentProduct: IProduct | null = null;
    private dataSource: 'server' | 'fallback' = 'server';

    constructor(private apiClient: IApiClient) {}

    async loadProducts(): Promise<void> {
        const apiProducts = await this.apiClient.getProducts();

        this.dataSource = apiProducts === FALLBACK_API_PRODUCTS ? 'fallback' : 'server';
        console.log(`Данные загружены из ${this.dataSource}`);

        this.products = apiProducts.map(this.convertToProduct);
    }

    private convertToProduct(apiProduct: IApiProduct): IProduct {
        return {
            id: apiProduct.id,
            title: apiProduct.title,
            description: apiProduct.description,
            imageUrl: apiProduct.image,
            category: apiProduct.category as ProductCategory,
            price: apiProduct.price
        }
    }

    getProducts(): IProduct[] {
        return this.products;
    }
    getProductById(id: string): IProduct | undefined {
        return this.products.find(product => product.id === id);
    }
    setCurrentProduct(id: string): void {
        this.currentProduct = this.getProductById(id) || null;
    }
    setProducts(products: IProduct[]): void {
        this.products = products;
    }
    
}

// Модель корзины
// управляет товарами в корзине: добавлением, удалением, подсчетом итогового количества и цены
interface ICartModel {
    items: ICartItem[];
    totalPrice: number;
    addItem(product: IProduct): void;           // добавляет товар в корзину
                                               // Логика: проверяет, есть ли товар в items. Ессли нет, 
                                               // то добавляет новый СardItem и обновляет totalCount и totalPrice
    removeItem(productid: string): void;       // удаляет товар из корзины по ID
    clear(): void;                             // полностью очищает корзину после оформления заказа
}

// Модель заказа
// отвечает за оформление заказа и валидацию данных
interface IOrderModel {
    createOrder(cart: ICartItem[], totalPrice: number): Promise<IOrder>;  // отправляет данные заказа на сервер 
                                                    // и возвращает объект Order c ID и статусом заказа
    validateDeliveryData(): boolean;                // Проверяет, заполнены ли обязательные поля доставки адрес и способ оплаты
    validateCustomerData(): boolean;                // Проверяет, заполнены ли обязательные поля контактов email и телефон
}

export { IProduct, ICartItem, ICartData, ICustomerContacts, IOrder, IProductModel, ICartModel, IOrderModel };