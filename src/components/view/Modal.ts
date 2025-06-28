import { Component } from '../core/Component';
import { IProduct } from '../../types/app.types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../core/EventEmitter';

export class ProductModal extends Component<{ product: IProduct }> {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _image: HTMLImageElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _category: HTMLElement;
    private _product: IProduct | null = null;

    constructor(container: HTMLElement) {
        super(container);
        
        // Находим все элементы (как в оригинале)
        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
    }

    set product(value: IProduct) {
        this._product = value;
        this.updateButton();
    }

    private updateButton() {
        if (!this._product) return;
        
        const isUnavailable = this._product.price === null;
        this._button.disabled = isUnavailable;
        this._button.textContent = isUnavailable ? 'Недоступно' : 'В корзину';
    }

    render(data?: { product: IProduct }): HTMLElement {
        if (!data?.product) return this.container;
        
        const { product } = data;
        this._product = product;

        // Заполняем данные (как в оригинале)
        this._title.textContent = product.title;
        this._description.textContent = product.description;
        this._image.src = product.imageUrl;
        this._image.alt = product.title;
        this._price.textContent = product.price ? `${product.price} синапсов` : 'Бесценно';
        
        // Обработка категории
        const categoryClass = this.getCategoryClass(product.category);
        this._category.textContent = product.category;
        this._category.className = `card__category ${categoryClass}`;

        // Кнопка
        this.updateButton();

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

export class CatalogView {
    private template: HTMLTemplateElement;

    constructor(
        protected container: HTMLElement,
        protected events: IEvents
    ) {
        // Находим шаблон один раз при создании
        this.template = ensureElement<HTMLTemplateElement>('#card-catalog');
    }

    render(products: IProduct[]) {
        try {
            // Очищаем контейнер
            this.container.innerHTML = '';

            // Создаём DocumentFragment для эффективного добавления
            const fragment = document.createDocumentFragment();

            products.forEach(product => {
                // Клонируем шаблон
                const cardNode = document.importNode(this.template.content, true);
                const cardElement = cardNode.firstElementChild as HTMLElement;

                if (!cardElement) {
                    console.warn('Шаблон карточки пустой');
                    return;
                }

                // Заполняем данные с проверками
                this.fillCardData(cardElement, product);

                // Добавляем обработчик
                this.setupCardEvents(cardElement, product);

                fragment.appendChild(cardElement);
            });

            this.container.appendChild(fragment);
        } catch (error) {
            console.error('Ошибка рендеринга каталога:', error);
        }
    }

    private fillCardData(cardElement: HTMLElement, product: IProduct) {
        // Безопасное заполнение данных
        const setTextContent = (selector: string, value: string) => {
            const element = cardElement.querySelector(selector);
            if (element) element.textContent = value;
        };

        setTextContent('.card__title', product.title);
        setTextContent('.card__price', product.price ? `${product.price} синапсов` : 'Бесценно');
        
        // Установка изображения
        const img = cardElement.querySelector('.card__image') as HTMLImageElement;
        if (img) {
            img.src = product.imageUrl;
            img.alt = product.title;
        }

        // Установка категории (если нужно)
        const category = cardElement.querySelector('.card__category');
        if (category) {
            category.textContent = product.category;
            category.className = `card__category ${this.getCategoryClass(product.category)}`;
        }
    }

    private setupCardEvents(cardElement: HTMLElement, product: IProduct) {
        // Обработчик на всю карточку
        cardElement.addEventListener('click', () => {
            this.events.emit('product:selected', { product });
        });

        // Альтернативно: можно вешать на кнопку, если она есть
        const button = cardElement.querySelector('button');
        if (button) {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.events.emit('product:add-to-cart', { product });
            });
        }
    }

    private getCategoryClass(category: string): string {
        const map: Record<string, string> = {
            'софт-скил': 'card__category_soft',
            'хард-скил': 'card__category_hard',
            'дополнительное': 'card__category_additional',
            'кнопка': 'card__category_button',
            'другое': 'card__category_other'
        };
        return map[category] || '';
    }
}

export interface IModalData {
    content?: HTMLElement;
}

export class ModalView extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;
    protected _container: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);
        this._container = ensureElement<HTMLElement>('.modal__container', container);

        this._closeButton.addEventListener('click', this.close.bind(this));
        this._container.addEventListener('click', (event) => {
            if (event.target === this._container) {
                this.close();
            }
        });
    }

    private toggleModal(state: boolean): void {
        console.log('toggleModal вызван, состояние:', state); // Добавьте это
        this._container.classList.toggle('modal_active', state);
        document.body.classList.toggle('page__wrapper_locked', state);
    }
    //private toggleModal(state: boolean): void {
    //    this._container.classList.toggle('modal_active', state);
    //    document.body.classList.toggle('page__wrapper_locked', state);
    //}

    showModal(content: HTMLElement): void {
        this._content.replaceChildren(content);
        this._container.style.display = 'flex';  // Принудительно
        this._container.style.opacity = '1';
    }

    close(): void {
        this.toggleModal(false);
        document.removeEventListener('keydown', this.handleKeyDown);
        this.events.emit('modal:closed');
    }

    private handleKeyDown = (event: KeyboardEvent): void => {
        if (event.key === 'Escape') this.close();
    };

    render(data?: { content: HTMLElement }): HTMLElement {
        if (data?.content) {
            this.showModal(data.content);
        }
        return this.container;
    }
}