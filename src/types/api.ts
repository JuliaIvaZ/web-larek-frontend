// Типы данных API

// Получаем с сервера при загрузке каталога товаров,
// в ProductModel преобразуем в локальный тип Product
interface ApiProduct {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number | null;
}

// Элемент корзины с сервера,
// в CartModel преобразуем в локальный тип CartItem
interface ApiCartItem {
    productId: string;
    priceSnapshot: number; // цена на момент добавления
}

// Данные заказа с сервера, отправляются на сервер
// при оформлении
interface ApiOrder {
    id: string;                 // номер заказа
    item: ApiCartItem[];        // товары
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

interface IApiClient {
    // 1. Получить список товаров
    getProducts(): Promise<ApiProduct[]>;
    
    // 2. Получить конкретный товар по ID
    getProductById(id: string): Promise<ApiProduct>;

    // 3. Добавить товар в корзину
    addToCart(productId: string): Promise<ApiCartItem>;

    // 4. Удалить товар из корзины
    removeFromCart(productId: string): Promise<void>;

    // 5. Создать заказ
    createOrder(orderData: Omit<ApiOrder, 'id' | 'status'>): Promise<ApiOrder>;
}

export { IApiClient, ApiProduct, ApiCartItem, ApiOrder };