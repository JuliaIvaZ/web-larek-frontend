import { ICartModel, ID, IOrderModel, IOrderRequest, IProduct, IProductModel, TCartItem, ValidationErrors } from "../../types/app.types";
import { IEvents } from "../core/EventEmitter";
import { ICard } from "../../types/views.types";
import { Component } from "../core/Component";
import { ensureElement } from "../../utils/utils";

// Приведено
export class ProductCard<T> extends Component<ICard<T>> {
    protected _id: ID;             
    protected _title: HTMLHeadingElement;
    protected _price: HTMLSpanElement;
    protected _description?: HTMLParagraphElement;
    protected _image?: HTMLImageElement;
    protected _category?: HTMLSpanElement;
    protected _button?: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);

        this._title = ensureElement<HTMLHeadingElement>('.card__title', this.container);
        this._price = ensureElement<HTMLSpanElement>('.card__price', this.container);
        this._description = container.querySelector('.card__text');
        this._image = container.querySelector('.card__image');
        this._category = container.querySelector('.card__category');
    }

    set id(value: ID) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number) {
        if (value !== null) {
            this.setText(this._price, `${value} синапсов`);
        } else {
            this.setText(this._price, `0 синапсов`);
        }
        
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }

    get category(): string {
        return this.container.dataset.category || '';
    }

    set category(value: string) {
        this.setText(this._category, value);
    }
}

// Приведено
export class CartModel implements ICartModel {
    private _items: TCartItem[] = [];
    protected events: IEvents;
    
    constructor(events: IEvents) {
        this.events = events;
    }

    // Метод получения всех товаров
    get items(): TCartItem[] {
        return this._items;
    }

    // Метод добавления товара в корзину
    addProduct(product: TCartItem): void {
        if (this.hasProduct(product.id)) {
            console.log(`Товар с ID ${product.id} уже добавлен`);
            return;
        }
        
        this._items.push(product);
        this.events.emit('basket:added', product);
    }

    // Метод удаления товара из корзины по ID
    removeProduct(productId: string): void {
        this._items = this.items.filter(item => item.id !== productId);
        this.events.emit('basket:deleted');
    }

    // Метод очистки корзины
    clear(): void {
        this._items = [];
        this.events.emit('basket:cleared');
    }

    // Метод получения количества товаров
    getCount(): number {
        return this.items.length;
    }

    // Метод подсчета общей суммы
    getTotal(): number {
        return this.items.reduce((total, item) => {
            // Проверяем, что цена не null
            return item.price !== null ? total + item.price : total;
        }, 0);
    }

    // Метод проверки наличия товара в корзине
    hasProduct(productId: string): boolean {
        return this.items.some(item => item.id === productId);
    }

    getProductIds(): string[] {
        return this.items.map(item => item.id);
    }
}

// Приведено
export class ProductModel implements IProductModel {
    //     Класс отвечает за хранение карточек товаров.
    // Конструктор класса принимает экземпляр брокера событий.
    // В полях класса хранятся следующие данные:
    _items: IProduct[] = [];
    preview: string | null;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    setItems(productArray: IProduct[]) {
        this._items = productArray;
        this.events.emit('productsList:loaded');
    }

    getItems() {
        return this._items;
    }

    // Метод для получения карточки по ID
    getProduct(id: string): IProduct | undefined {
        return this._items.find(product => product.id === id);
    }

    setPreview(item: IProduct) {
        this.preview = item.id;
    }   
}

// Приведено
export class UserModel implements IOrderModel {
    protected events: IEvents;
    order: IOrderRequest = {
        email: '',
        phone: '',
        payment: null,
        address: ''
    };
    formErrors: ValidationErrors = {};

    constructor(order: IOrderRequest, events: IEvents) {
        this.order = order;
        this.events = events;
    }

    emitChanges(event: string, payload?: object) {
        this.events.emit(event, payload ?? {});
    }

    get orderData(): IOrderRequest {
        return this.order;
    }

    setOrderField(field: keyof IOrderRequest, value: string) {
        this.order[field] = value;

        this.emitChanges('order:changed', {field: field})
    }

    validateOrder() {
        const errors: ValidationErrors = {};

        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }

        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }

        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }

        if (!this.order.payment) {
            errors.payment = 'Необходимо указать вид оплаты';
        }

        this.formErrors = errors;

        return errors;
    }

    initOrder() {
        this.order = {
            payment: null,
            email: '',
            phone: '',
            address: '',
        };
        this.emitChanges('order:changed')
    }
}