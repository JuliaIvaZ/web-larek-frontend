import { ApiClient } from "./base/api";
import { ICard, IProduct,ProductModel } from "../types/models";
import { CatalogView, ModalView } from "./appData";
import { EventEmitter } from "./base/events";
import { CDN_URL, API_URL } from "../utils/constants";
import { Component } from "./base/component";
import { cloneTemplate, ensureElement } from "../utils/utils";
import { CartModel } from "./cartModel";

export class App {
    private cart: IProduct[] = [];

    private modalView: ModalView;
    private productModal: ProductModal;
    private modalTemplate: HTMLTemplateElement;

    private apiClient: ApiClient;
    private productModel: ProductModel;
    private catalogView: CatalogView;
    private events: EventEmitter;

    private cartModel: CartModel;
    private productCards: ICard[] = [];

    private setPageLock(state: boolean): void {
        const pageWrapper = document.querySelector('.page__wrapper');
        if (pageWrapper) {
            pageWrapper.classList.toggle('page__wrapper_locked', state);
        }
    }
    
    constructor() {
        this.events = new EventEmitter();
        this.apiClient = new ApiClient(CDN_URL, API_URL);
        this.productModel = new ProductModel(this.apiClient);
        this.catalogView = new CatalogView(
            document.querySelector('.page__wrapper') as HTMLElement,
            this.events
        );

        this.init();

        this.modalView = new ModalView(
            ensureElement<HTMLElement>('#modal-container'), 
            this.events
        );
        
        this.modalTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
        
        this.events.on('modal:opened', () => this.setPageLock(true));
        this.events.on('modal:closed', () => this.setPageLock(false));
        this.events.on('product:selected', (data: { product: IProduct }) => {
            this.openProductModal(data.product);
        });

        this.cartModel = new CartModel(this.events);

        this.events.on('cart:updated', (data: { cart: IProduct[] }) => {
            console.log('Корзина обновлена:', data.cart);
            this.updateCartCounter(data.cart.length);
        });
        
        this.events.on('items:changed', () => {
            this.updateProductsState();
        });
        
    }

    private updateProductsState(): void {
        this.productCards.forEach(card => {
            card.setInCart(this.cartModel.hasItem(card.id));
        });
    }

    private createProductCard(product: IProduct): HTMLElement {
        const template = ensureElement<HTMLTemplateElement>('#card-catalog');
        const cardElement = cloneTemplate<HTMLElement>(template);

        const card = new Card(cardElement, this.cartModel.hasItem(product.id), {
            onClick: () => {
                this.cartModel.addItem(product);
            }
        });

        this.productCards.push(card);
                
        // Заполняем данные карточки
        ensureElement<HTMLElement>('.card__title', cardElement).textContent = product.title;
        ensureElement<HTMLImageElement>('.card__image', cardElement).src = product.imageUrl;
        ensureElement<HTMLElement>('.card__price', cardElement).textContent = 
            product.price ? `${product.price} синапсов` : 'Бесценно';

        return cardElement;
    }

    private openProductModal(product: IProduct): void {
        const modalContent = cloneTemplate<HTMLElement>(this.modalTemplate);
        const isInCart = this.cartModel.hasItem(product.id);
        const modal = new ProductModal(modalContent, isInCart);
        
        modal.render({ product });
        this.modalView.open(modalContent);

        // Обработчик кнопки "В корзину"
        const button = ensureElement<HTMLButtonElement>('.card__button', modalContent);
        button.addEventListener('click', () => {
            this.addToCart(product);
            this.modalView.close();
        });

        this.modalView.open(modalContent);
    }

    private addToCart(product: IProduct): void {
        if (product.price === null) return;
        
        this.cart.push(product);
        this.updateCartCounter(this.cart.length);
        this.events.emit('cart:updated', { cart: this.cart });
    }

    private async init() {
        try {
            await this.productModel.loadProducts();
            this.catalogView.render(this.productModel.getProducts());

         //   this.events.on('product:selected', (data: { product: IProduct }) => {
         //       console.log('Выбран товар: ', data.product);
         //   });
        } catch (error) {
            console.error('Ошибка при инициализации приложения: ', error);
        }
    }
    private initModals() {
        this.events.on('product:selected', (data: { product: IProduct }) => {
            this.openProductModal(data.product);
        });

        this.events.on('modal:closed', () => {
            // Дополнительные действия при закрытии модального окна
        });
    }

    private updateCartCounter(count: number): void {
        const counter = ensureElement<HTMLElement>('.header__basket-counter');
        counter.textContent = String(count);
    }
}

export class ProductModal extends Component<{ product: IProduct }> {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _image: HTMLImageElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _category: HTMLElement;

    constructor(container: HTMLElement, private inCart: boolean) {
        super(container);
        
        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
        
    }

    set isInCart(value: boolean) {
        this._button.disabled = value || this._price === null;
        this._button.textContent = value ? 'В корзине' : 'Купить';
    }

    render(data?: { product: IProduct }): HTMLElement {
        if (!data?.product) return this.container;

        const { product } = data;
        //super.render(data);

        //this._description.textContent = product.description;
        //this._button.disabled = product.price === null;

        //return this.container;
        this._title.textContent = product.title;
        this._description.textContent = product.description;
        this._image.src = product.imageUrl;
        this._image.alt = product.title;
        
        // Обработка цены
        this._price.textContent = product.price ? `${product.price} синапсов` : 'Бесценно';
        
        // Обработка категории
        const categoryClass = this.getCategoryClass(product.category);
        this._category.textContent = product.category;
        this._category.className = `card__category ${categoryClass}`;
        
        // Кнопка "В корзину"
        this._button.disabled = product.price === null;
        if (product.price === null) {
            this._button.classList.add('button_disabled');
        } else {
            this._button.classList.remove('button_disabled');
        }
        return this.container;
    }

    private getCategoryClass(category: string): string {
        const map: Record<string, string> = {
            'софт-скил': 'card__category_soft',
            'хард-скил': 'card__category_hard',
            'дополнительное': 'card__category_additional',
            'кнопка': 'card__category_button',
            'другое': 'card__category_other'
        };
        return map[category] || 'card__category_other';
    }
}



interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IProduct> implements ICard {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _inCart: boolean;

    constructor(
        public readonly container: HTMLElement, // Делаем public readonly
        inCart: boolean = false,
        actions?: ICardActions
    ) {
        super(container);
        
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', container);
        this._inCart = inCart;

        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    get inCart(): boolean {
        return this._inCart;
    }

    setInCart(value: boolean): void {
        this._inCart = value;
        this.updateButton();
    }

    private updateButton(): void {
        this._button.disabled = this._inCart || !this._price.textContent?.includes('синапсов');
        this._button.textContent = this._inCart ? 'В корзине' : 'Купить';
    }

    render(data?: Partial<IProduct>): HTMLElement {
        if (!data) return this.container;

        super.render(data);

        if (data.id) this.container.dataset.id = data.id;
        if (data.title) this._title.textContent = data.title;
        if (data.imageUrl) this._image.src = data.imageUrl;
        if (data.imageUrl) this._image.alt = data.title || 'Изображение товара';
        if (data.category) {
            this._category.textContent = data.category;
            this._category.className = `card__category card__category_${this.getCategoryClass(data.category)}`;
        }
        if (data.price !== undefined) {
            this._price.textContent = data.price ? `${data.price} синапсов` : 'Бесценно';
        }

        this.updateButton();

        return this.container;
    }

    private getCategoryClass(category: string): string {
        const map: Record<string, string> = {
            'софт-скил': 'soft',
            'хард-скил': 'hard',
            'дополнительное': 'additional',
            'кнопка': 'button',
            'другое': 'other'
        };
        return map[category] || 'other';
    }
}