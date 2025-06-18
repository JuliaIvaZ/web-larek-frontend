import { CartData, Product } from "./models";
// Интерфейсы представлений

// Интерфейс для списка товаров,
// отвечает за отображение каталога товаров на главной странице
interface IProductListView {
    render(products: Product[]): void;      // отрисовывает список товаров на основе переданных данных
                                                    // В презентере создается список ХТМЛЭлементов из 
                                                    // представлений и передается в рендер
}

// Интерфейс отображения информации о товаре
interface IProductView {
    getContentElement(): HTMLElement;               // возвращает элемент разметки страницы
    render(product: Product): void;                 // отрисовывает товар на основе переданных данных
}

// Представление корзины
// отвечает за отображение корзины и кнопки оформления заказа
interface ICartView {
    getContentElement(): HTMLElement;               // возвращает корзину
    render(cartData: CartData): void;               // отрисовывает корзину на основе переданных данных
                                                    // вызывается при открытии корзины и после добавления/удаления товара
                                                    // Работает так же, как в IProductListView
    toggleCheckoutButton(enable: boolean): void;    // активирует/деактивирует кнопку оформления заказа
    totalPrice(): number;                           // возвращает общую стоимость товаров в корзине
}

// Представление оформления заказа
// управляет отображением первого шага оформления заказа
interface ICheckoutViewStep1 {
    getContentElement(): HTMLElement;               // возвращает элемент страницы
    render(): void;                                 // показывает первый шаг оформления (форма ввода адреса доставки и выбор способа оплаты)
}

// Представление оформления заказа
// управляет отображением второго шага оформления заказа
interface ICheckoutViewStep2 {
    getContentElement(): HTMLElement;               // возвращает элемент страницы
    render(): void;                                 // показывает первый шаг оформления (форма ввода емейла и номера телефона)
}

// Интерфейс модального окна
interface IModalView {
    showModal(content: HTMLElement): void;               // открывает модальное окно
    hideModal(): void;                                   // закрывает модально окно при клике на крестик или вне окна 
}

export { IProductListView, IModalView, IProductView, ICartView, ICheckoutViewStep1, ICheckoutViewStep2 };

