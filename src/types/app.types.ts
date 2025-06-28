// Типы данных приложения (внутренние типы приложения)
import { IApiClient, IApiProduct } from "./api.types";

// Категории товаров
export type ProductCategory = 'софт-скил' | 'хард-скил' | 'дополнительное' | 'кнопка' | 'другое';

// Товар в приложении
export interface IProduct extends Pick<IApiProduct, 'id' | 'title' | 'description'>{
    imageUrl: string;
    category: ProductCategory;
    price: number | null;
}

// Элемент корзины
export interface ICartItem {
    product: IProduct;
    count?: number;
}

// Состояние корзины
export interface ICartData {
    items: ICartItem[];
    totalPrice: number;
}

//Оформленный заказ. Создается в OrderModel при оформлении,
// отправляется на сервер (преобразуется в ApiOrder),
// получаем обратно с сервера id и  status????
export interface IOrder {
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
export interface IProductModel {
    getProducts(): IProduct[];                           // возвращает массив уже загруженных и преобразованных в 
                                                        // Product товаров при открытии главной страницы, при успешной загрузке данных с сервера
    getProductById(id: string): IProduct | undefined;    // возвращает товар по его ID
    setCurrentProduct(id: string): void;                // устанавливает текущий выбранный товар (например, для отображения
                                                        // в модальном окне)
    setProducts(products: IProduct[]): void;              // устанавливает массив товаров
}

// Модель корзины
// управляет товарами в корзине: добавлением, удалением, подсчетом итогового количества и цены
export interface ICartModel {
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
export interface IOrderModel {
    createOrder(cart: ICartItem[], totalPrice: number): Promise<IOrder>;  // отправляет данные заказа на сервер 
                                                    // и возвращает объект Order c ID и статусом заказа
    validateDeliveryData(): boolean;                // Проверяет, заполнены ли обязательные поля доставки адрес и способ оплаты
    validateCustomerData(): boolean;                // Проверяет, заполнены ли обязательные поля контактов email и телефон
}

export interface CartUpdateEvent {
    items: IProduct[]; // Всегда используем items вместо cart
}








// Способы оплаты
export type PaymentMethod = 'online' | 'then';

// Контакты покупателя. Так как поля обязательные, 
// валидация проверяется в OrderModel
export interface ICustomerContacts {
    email: string;
    phone: string;
}
