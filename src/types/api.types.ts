// Типы данных API

// Получаем с сервера при загрузке каталога товаров,
// в ProductModel преобразуем в локальный тип Product
export interface IApiProduct {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number | null;
}

// Элемент корзины с сервера,
// в CartModel преобразуем в локальный тип CartItem
export interface IApiCartItem {
    productId: string;
    priceSnapshot: number; // цена на момент добавления
}

// Данные заказа с сервера, отправляются на сервер
// при оформлении
export interface IApiOrder {
    id: string;                 // номер заказа
    item: IApiCartItem[];        // товары
    deliveryAddress: string;    // адрес
    paymentMethod: string;      // способ оплаты
    customerContacts: {         // контакты
        email: string;
        phone: string;
    };
    total: number;              // общая стоимость
    status: string;             // статус
}

// Интерфейс API-клиента
// Используется для работы с сервером.
// Описывает возможные API-запросы, их параметры и возвращаемые данные

export interface IApiClient {
    readonly cdnUrl: string;
    readonly baseUrl: string;
    convertImagePath(imageUrl: string): string;

    // 1. Получить список товаров
    getProducts(): Promise<IApiProduct[]>;
    
    // 2. Получить конкретный товар по ID
    getProductById(id: string): Promise<IApiProduct>;

    // 3. Добавить товар в корзину
    addToCart(productId: string): Promise<IApiCartItem>;

    // 4. Удалить товар из корзины
    removeFromCart(productId: string): Promise<void>;

    // 5. Создать заказ
    createOrder(orderData: Omit<IApiOrder, 'id' | 'status'>): Promise<IApiOrder>;

}

