import { ICartData, IProduct } from "./app.types";
// Интерфейсы представлений

export interface ICard {
    readonly id: string;
    readonly container: HTMLElement;
    readonly isInCart: boolean;
    setInCart(value: boolean): void;
    render(data?: Partial<IProduct>): HTMLElement;
}

// Интерфейс модального окна
export interface IModalView {
    showModal(content: HTMLElement): void;               // открывает модальное окно
    hideModal(): void;                                   // закрывает модально окно при клике на крестик или вне окна 
}

// Представление корзины
// отвечает за отображение корзины и кнопки оформления заказа
export interface ICartView {
    getContentElement(): HTMLElement;               // возвращает корзину
    render(cartData: ICartData): void;               // отрисовывает корзину на основе переданных данных
                                                    // вызывается при открытии корзины и после добавления/удаления товара
                                                    // Работает так же, как в IProductListView
    toggleCheckoutButton(enable: boolean): void;    // активирует/деактивирует кнопку оформления заказа
    totalPrice(): number;                           // возвращает общую стоимость товаров в корзине
}

// Интерфейс отображения информации о товаре
export interface IProductView {
    getContentElement(): HTMLElement;               // возвращает элемент разметки страницы
    render(product: IProduct): void;                 // отрисовывает товар на основе переданных данных
}

// Интерфейс для списка товаров,
// отвечает за отображение каталога товаров на главной странице
export interface IProductListView {
    render(products: IProduct[]): void;      // отрисовывает список товаров на основе переданных данных
                                                    // В презентере создается список ХТМЛЭлементов из 
                                                    // представлений и передается в рендер
}

// Представление оформления заказа
// управляет отображением первого шага оформления заказа
export interface ICheckoutViewStep1 {
    getContentElement(): HTMLElement;               // возвращает элемент страницы
    render(): void;                                 // показывает первый шаг оформления (форма ввода адреса доставки и выбор способа оплаты)
}

// Представление оформления заказа
// управляет отображением второго шага оформления заказа
export interface ICheckoutViewStep2 {
    getContentElement(): HTMLElement;               // возвращает элемент страницы
    render(): void;                                 // показывает первый шаг оформления (форма ввода емейла и номера телефона)
}

















