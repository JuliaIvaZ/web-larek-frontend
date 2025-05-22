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

// Модель товаров
// управляет данными о товарах: загрузкой, поиском, текущим выбранным товаром
interface IProductModel {
    getProducts(): Product[];                           // возвращает массив уже загруженных и преобразованных в 
                                                        // Product товаров при открытии главной страницы, при успешной загрузке данных с сервера
    getProductById(id: string): Product | undefined;    // возвращает товар по его ID
    setCurrentProduct(id: string): void;                // устанавливает текущий выбранный товар (например, для отображения
                                                        // в модальном окне)
}

// Модель корзины
// управляет товарами в корзине: добавлением, удалением, подсчетом итогового количества и цены
interface ICartModel {
    items: CartItem[];
    totalPrice: number;
    totalCount: number;
    addItem(product: Product): void;           // добавляет товар в корзину
                                               // Логика: проверяет, есть ли товар в items. Ессли нет, 
                                               // то добавляет новый СardItem и обновляет totalCount и totalPrice
    removeitem(productid: string): void;       // удаляет товар из корзины по ID
    clear(): void;                             // полностью очищает корзину после оформления заказа
}

// Модель заказа
// отвечает за оформление заказа и валидацию данных
interface IOrderModel {
    createOrder(cart: CartItem[]): Promise<Order>;  // отправляет данные заказа на сервер 
                                                    // и возвращает объект Order c ID и статусом заказа
    validateDeliveryData(): boolean;                // Проверяет, заполнены ли обязательные поля доставки адрес и способ оплаты
    validateCustomerData(): boolean;                // Проверяет, заполнены ли обязательные поля контактов email и телефон
}

// Интерфейсы представлений

// Интерфейс для списка товаров,
// отвечает за отображение каталога товаров на главной странице
interface IProductListView {
    render(products: Product[]): void;      // отрисовывает список товаров на основе переданных данных
}

// Интерфейс моадльного окна товара
// отвечает за отображение подробной информации о товаре и взаимодействие с корзиной
interface IProductModalView {
    show(product: Product): void;                   // открывает модальное окно с информацией о товаре
    hide(): void;                                   // закрывает модально окно при клике на крестик или вне окна 
}

// Представление корзины
// отвечает за отображение корзины и кнопки оформления заказа
interface ICartView {
    render(cartData: CartData): void;               // перерисовывает корзину на основе переданных данных
                                                    // вызывается при открытии корзины и после добавления/удаления товара
    toggleCheckoutButton(enable: boolean): void;    // активирует/деактивирует кнопку оформления заказа
}

// Представление оформления заказа
// управляет отображением шагов оформления заказа и результата
interface ICheckoutView {
    renderStep1(): void;    // показывает первый шаг оформления (форма ввода адреса доставки и выбор способа оплаты)
    renderStep2(): void;    // открывает второй шаг (форма ввода контактных данных и кнопка подтверждения заказа)
    showSuccess(): void;    // показывает сообщение об успешном оформлении заказа и очищает корзину
}

export { Product, CartData, Order}