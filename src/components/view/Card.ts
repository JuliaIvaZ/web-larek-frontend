import { ID, IProduct } from '../../types/app.types';
import { ensureElement } from '../../utils/utils';
import { ICard } from '../../types/views.types';
import { Component } from '../core/Component';

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

    set price(value: number | null) {
        if (value !== null) {
            this.setText(this._price, `${value} синапсов`);
        } else {
            this.setText(this._price, `Бесценно`);   
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
        this.setCategoryClass(value); // Добавляем класс при установке категории
    }

    // Новый метод для установки класса категории
    protected setCategoryClass(category: string): void {
        const categoryClass = this.getCategoryClass(category);
        if (this._category) {
            // Удаляем все возможные предыдущие классы категории
            this._category.className = 'card__category';
            // Добавляем нужный класс
            this._category.classList.add(categoryClass);
        }
    }
    
        // Метод для определения класса (можно оставить private)
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

// Приведено
export class Card extends ProductCard<ICard<IProduct>> {
    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container)
        this._button = container as HTMLButtonElement;
        
        
        this._button.addEventListener('click', (event) => {
            event.preventDefault();
            actions?.onClick?.(event);
        });
    }
}

interface ICardPreview {
    onClick: (event: MouseEvent) => void;
}

// Приведено
export class CardForModal extends ProductCard<ICard<IProduct>> {
    constructor(container: HTMLElement, actions?: ICardPreview, isInBasket?: boolean) {
        super(container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this._button.addEventListener('click', (event: MouseEvent) => {
            actions?.onClick?.(event);
            this.setDisabled(this._button, true);
        });

        if (isInBasket) {
            this.setDisabled(this._button, true);
        }
    }
    render(data: IProduct): HTMLElement {
        super.render(data);
        
        // Если цена null ("Бесценно"), блокируем кнопку
        if (data.price === null) {
            this.setDisabled(this._button, true);
        }
        
        return this.container;
    }

    getContainer(): HTMLElement {
        return this.container;
    }
}

interface ICardBasket {
    onClick: (event: MouseEvent) => void;
}
type TBasketCardType = Pick<IProduct, 'id' | 'title'| 'price'>

// Приведено
export class CardForBasket extends ProductCard<TBasketCardType> {
    protected _index: HTMLSpanElement;
    private _currentIndex = 0;

    constructor(container: HTMLElement, actions?: ICardBasket) {
        super(container);

        this._index = ensureElement<HTMLSpanElement>('.basket__item-index', this.container);
        this._button = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
        
        this._button.addEventListener('click', (event: MouseEvent) => {
            actions?.onClick?.(event);
        });
    }

    set index(value: number) {
        this._currentIndex = value;
        this.setText(this._index, String(value));
    }

    get index(): number {
        return this._currentIndex;
    }
}

