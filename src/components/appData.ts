import { Component } from "./base/component";
import { IProduct } from "../types/models";
import { ensureElement, cloneTemplate } from "../utils/utils";
import { IEvents } from "./base/events";
import { IProductListView } from "../types/views";

//interface ICatalogView {
//    products: IProduct[];
//}

export class CatalogView implements IProductListView {
    protected _items: HTMLElement[] = [];
    protected _container: HTMLElement;
    protected _catalogContainer: HTMLElement;
    protected _template: HTMLTemplateElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        this._container = container;
        this._catalogContainer = ensureElement<HTMLElement>('.gallery', container);
        this._template = ensureElement<HTMLTemplateElement>('#card-catalog');
    }

    render(products: IProduct[]): void {
        this._items = products.map(product => this.createCard(product));
        this._catalogContainer.replaceChildren(...this._items);
    }

    private createCard(product: IProduct): HTMLElement {
        const card = cloneTemplate<HTMLElement>(this._template);

        const title = ensureElement<HTMLElement>('.card__title', card);
        title.textContent = product.title;

        const image = ensureElement<HTMLImageElement>('.card__image', card);
        image.src = product.imageUrl;
        image.alt = product.title;

        const category = ensureElement<HTMLElement>('.card__category', card);
        category.textContent = product.category;

        const categoryClassMap = {
            'софт-скил': 'soft',
            'хард-скил': 'hard',
            'дополнительное': 'additional',
            'кнопка': 'button',
            'другое': 'other'
        };

        //const categoryClass = categoryClassMap[product.category]

        category.className = `card__category card__category_${categoryClassMap[product.category]}`;
            
        const price = ensureElement<HTMLElement>('.card__price', card);
        price.textContent = product.price ? `${product.price} синапсов` : 'Бесценно';

        card.addEventListener('click', () => {
            this.events.emit('product:selected', { product });
        });

        return card;
    }
}

interface IModalData {
    content: HTMLElement;
}

export class ModalView extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;
    protected _container: HTMLElement;

    constructor(container: HTMLElement, protected evetns: IEvents) {
        super(container);

        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);
        this._container = ensureElement<HTMLElement>('.modal__container', container);

        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.close();
            }
        });
    }

    //private handleOutsideClick(event: MouseEvent) {
    //    if (event.target === this.container) {
    //        this.close();
    //    }
    //}

    open(content: HTMLElement): void {
        this._content.replaceChildren(content);
        this.toggleModal(true);
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.body.classList.add('page__wrapper_locked');
        //this.evetns.emit('modal:open');
    }

    close(): void {
        this.toggleModal(false);
        document.removeEventListener('keydown', this.handleKeyDown.bind(this));
        document.body.classList.remove('page__wrapper_locked');
        this.evetns.emit('modal:close');
    }

    private toggleModal(state: boolean): void {
        this.container.classList.toggle('modal_active', state);
    }

    private handleKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            this.close();
        }
    }

    render(data?: IModalData): HTMLElement {
        if (data?.content) {
            this.open(data.content);
        }
        return this.container;
    }
}