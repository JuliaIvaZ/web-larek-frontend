import { Component } from '../core/Component';
import { IProduct } from '../../types/app.types';
import { ensureElement } from '../../utils/utils';
import { ICard } from '../../types/views.types';
import { ProductCard } from '../model/AppModel';

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