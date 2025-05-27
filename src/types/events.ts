import { Product, CartData, Order } from "./models";  

// События 

// Перечисление событий
// Список всех возможных событий, сгруппированных по функциональности
enum AppEvents {
    // Товары
    PRODUCTS_LOADED = 'products:loaded',                // Товары загружены (передается массив Product[])
    PRODUCT_SELECTED = 'product:selected',              // Пользователь выбрал товар (передается Product)

    // Корзина
    CART_ITEM_ADDED = 'cart:item-added',                // Товар добавлен в корзину 
    CART_ITEM_REMOVED = 'cart:item-removed',            // Товар удален из корзины 
    CART_UPDATED = 'cart:updated',                      // Состояние корзины изменилось (передается CartData)

    // Заказ
    ORDER_STARTED = 'order:started',                    // Пользователь начал оформление заказа
    ORDER_STEP1_COMPLETED = 'order:step1-completed',    // Пользователь заполнил адрес доставки и способ оплаты (завершен первый шаг)
    ORDER_STEP2_COMPLETED = 'order:step2-completed',    // Пользователь заполнил контактные данные (завершен второй шаг)
    ORDER_COMPLETED = 'order:completed',                // Заказ оформлен (передается Order)

    // UI события
    MODAL_OPENED = 'ui:modal-opened',                   // Открыто модальное окно (передается Product)
    MODAL_CLOSED = 'ui:modal-closed'                    // Закрыто модальное окно
}

// Типы данных событий
// Связывает событие с типом передаваемых данных
type EventMap = {
    [AppEvents.PRODUCTS_LOADED]: { products: Product[]};
    [AppEvents.PRODUCT_SELECTED]: { product: Product};
    [AppEvents.CART_ITEM_ADDED]: { productId: string };
    [AppEvents.CART_ITEM_REMOVED]: { productId: string };
    [AppEvents.CART_UPDATED]: { cart: CartData };
    [AppEvents.ORDER_STARTED]: undefined;
    [AppEvents.ORDER_STEP1_COMPLETED]: { deliveryAddress: string, paymentMethod: string };
    [AppEvents.ORDER_STEP2_COMPLETED]: { email: string, phone: string };
    [AppEvents.ORDER_COMPLETED]: { order: Order};
    [AppEvents.MODAL_OPENED]: { product: Product };
    [AppEvents.MODAL_CLOSED]: undefined;
}

// Проверка того, что событие R существует в EventMap
type _ApproveEventEntry = {
    [R in AppEvents]: EventMap[R];
}

// Определяет методы для работы с событиями
interface IEventEmitter {
    on<T extends AppEvents>(event: T, callback: (data: EventMap[T]) => void): void;     // Подписывает на событие
    off<T extends AppEvents>(event: T, callback: (data: EventMap[T]) => void): void;    // Отписывает от события
    emit<T extends AppEvents>(event: T, data: EventMap[T]): void;                       // Генерирует событие
}

export { AppEvents, IEventEmitter, EventMap }