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

// Типы данных приложения (внутренние типы приложения)

// Категории товаров
type ProductCategory = 'софт-скил' | 'хард-скил' | 'дополнительное' | 'кнопка' | 'другое';

// Товар в приложении
interface Product {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    category: ProductCategory;
    price: number | null;
}

// Элемент корзины
interface CartItem {
    product: Product;
    totalPrice: number;
}

// Состояние корзины
interface CartData {
    items: CartItem[];
    totalPrice: number;
    totalCount: number;
}

// Способы оплаты
type PaymentMethod = 'online' | 'then';

// Контакты покупателя. Так как поля обязательные, 
// валидация проверяется в OrderModel
interface CustomerContacts {
    email: string;
    phone: string;
}

//Оформленный заказ. Создается в OrderModel при оформлении,
// отправляется на сервер (преобразуется в ApiOrder),
// получаем обратно с сервера id и  status????
interface Order {
    id: string;
    item: CartItem[];
    paymentMethod: PaymentMethod;
    customerContacts: CustomerContacts;
    total: number;
    status: string;
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

// Интерфейсы моделей

interface IProductModel {
    getProducts(): Product[];
    getProductById(id: string): Product | undefined;
    setCurrentProduct(id: string): void;
}

interface ICartModel {
    items: CartItem[];
    totalPrice: number;
    totalCount: number;
    addItem(product: Product): void;
    removeitem(productid: string): void;
    clear(): void;
}

interface IOrderModel {
    createOrder(cart: CartItem[]): Promise<Order>;
    validateDeliveryData(): boolean;
    validateCustomerData(): boolean;
}

// Интерфейсы представлений

interface IProductListView {
    render(products: Product[]): void;
    showLoading(): void;
    hideLoading(): void;
}

interface IProductModalView {
    show(product: Product): void;
    hide(): void;
    updateCartButtons(isInCart: boolean): void;
}

interface ICartView {
    render(cartData: CartData): void;
    toggleCheckoutButton(enable: boolean): void;
}

interface ICheckoutView {
    renderStep1(): void;
    renderStep2(): void;
    showSuccess(): void;
}

// События 

enum AppEvents {
    // Товары
    PRODUCTS_LOADED = 'products:loaded',
    PRODUCT_SELECTED = 'product:selected',

    // Корзина
    CART_ITEM_ADDED = 'caart:item-added',
    CART_ITEM_REMOVED = 'cart:item-removed',
    CART_UPDATED = 'cart:updated',

    // Заказ
    ORDER_STARTED = 'order:started',
    ORDER_STEP1_COMPLETED = 'order:step1-completed',
    ORDER_STEP2_COMPLETED = 'order:step2-completed',
    ORDER_COMPLETED = 'order:completed',

    // UI события
    MODAL_OPENED = 'ui:modal-opened',
    MODAL_CLOSED = 'ui:modal-closed'
}

interface EventMap {
    [AppEvents.PRODUCTS_LOADED]: { products: Product[]};
    [AppEvents.PRODUCT_SELECTED]: { product: Product};
    [AppEvents.CART_UPDATED]: { cart: CartData };
    [AppEvents.ORDER_COMPLETED]: { order: Order};
    [AppEvents.MODAL_OPENED]: { product: Product };
    [AppEvents.MODAL_CLOSED]: { product: Product };
}

interface IEventEmitter {
    on<T extends AppEvents>(event: T, callback: (data: EventMap[T]) => void): void;
    off<T extends AppEvents>(event: T, callback: (data: EventMap[T]) => void): void;
    emit<T extends AppEvents>(event: T, data: EventMap[T]): void;
}