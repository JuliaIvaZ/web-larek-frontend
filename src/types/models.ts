// Типы данных приложения (внутренние типы приложения)

// Категории товаров
export type ProductCategory = 'софт-скил' | 'хард-скил' | 'дополнительное' | 'кнопка' | 'другое';

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

// Интерфейсы моделей

// Модель товаров
// управляет данными о товарах: загрузкой, поиском, текущим выбранным товаром
interface IProductModel {
    getProducts(): Product[];                           // возвращает массив уже загруженных и преобразованных в 
                                                        // Product товаров при открытии главной страницы, при успешной загрузке данных с сервера
    getProductById(id: string): Product | undefined;    // возвращает товар по его ID
    setCurrentProduct(id: string): void;                // устанавливает текущий выбранный товар (например, для отображения
                                                        // в модальном окне)
    setProducts(products: Product[]): void;              // устанавливает массив товаров
}

// Модель корзины
// управляет товарами в корзине: добавлением, удалением, подсчетом итогового количества и цены
interface ICartModel {
    items: CartItem[];
    totalPrice: number;
    addItem(product: Product): void;           // добавляет товар в корзину
                                               // Логика: проверяет, есть ли товар в items. Ессли нет, 
                                               // то добавляет новый СardItem и обновляет totalCount и totalPrice
    removeItem(productid: string): void;       // удаляет товар из корзины по ID
    clear(): void;                             // полностью очищает корзину после оформления заказа
}

// Модель заказа
// отвечает за оформление заказа и валидацию данных
interface IOrderModel {
    createOrder(cart: CartItem[], totalPrice: number): Promise<Order>;  // отправляет данные заказа на сервер 
                                                    // и возвращает объект Order c ID и статусом заказа
    validateDeliveryData(): boolean;                // Проверяет, заполнены ли обязательные поля доставки адрес и способ оплаты
    validateCustomerData(): boolean;                // Проверяет, заполнены ли обязательные поля контактов email и телефон
}

export { Product, CartItem, CartData, CustomerContacts,Order, IProductModel, ICartModel, IOrderModel };