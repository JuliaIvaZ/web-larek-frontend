import { Component } from '../core/Component';
import { IProduct } from '../../types/app.types';

interface CardActions {
    onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IProduct> {
    protected _button: HTMLButtonElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement, actions?: CardActions) {
        super(container);

        this._button = container.querySelector('.card__button');
        this._price = container.querySelector('.card__price');

        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set price(value: number | null) {
        this._price.textContent = value ? `${value} синапсов` : 'Бесценно';
    }

    set inCart(value: boolean) {
        this._button.disabled = value;
        this._button.textContent = value ? 'В корзине' : 'Купить';
    }

    get id(): string {
        return this.container.dataset.id || '';
    }
    
    setInCart(value: boolean): void {
        this._button.disabled = value;
        this._button.textContent = value ? 'В корзине' : 'Купить';
    }
}