import { Component } from './base/component';
import { IProduct } from '../types/models';
import { ensureElement } from '../utils/utils';

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IProduct> {
    protected _button: HTMLButtonElement;
    protected _price: HTMLElement;

    constructor(
        container: HTMLElement,
        protected isInCart: boolean,
        actions?: ICardActions
    ) {
        super(container);

        this._button = ensureElement<HTMLButtonElement>('.card__button', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);

        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set inCart(value: boolean) {
        this.updateButton(value);
    }

    private updateButton(inCart: boolean): void {
        this._button.disabled = inCart || !this._price.textContent?.includes('синапсов');
        this._button.textContent = inCart ? 'В корзине' : 'Купить';
    }
}