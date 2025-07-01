import { ICartModel, ID, IOrderModel, IOrderRequest, IProduct, IProductModel, TCartItem, ValidationErrors } from "../../types/app.types";
import { IEvents } from "../core/EventEmitter";

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

export class ProductModel implements IProductModel {
    // Класс отвечает за хранение карточек товаров.
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
            errors.email = 'Укажите email';
        }

        if (!this.order.phone) {
            errors.phone = 'Укажите телефон';
        }

        if (!this.order.address) {
            errors.address = 'Укажите адрес';
        }

        if (!this.order.payment) {
            errors.payment = 'Укажите вид оплаты';
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