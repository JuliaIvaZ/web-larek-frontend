// components/view/OrderView.ts

import { ICartView, IModalForm } from "../../types/views.types";
import { createElement, ensureElement } from "../../utils/utils";
import { Component } from "../core/Component";
import { IEvents } from "../core/EventEmitter";

// Приведено
export class CartView extends Component<ICartView> {
    protected _basketList: HTMLElement;
    protected _totalPrice: HTMLSpanElement;
    protected _buttonOrder: HTMLButtonElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.events = events;

        this._basketList = ensureElement<HTMLElement>('.basket__list', this.container);
        this._totalPrice = ensureElement<HTMLSpanElement>('.basket__price', this.container);
        this._buttonOrder = ensureElement<HTMLButtonElement>('.button', this.container);
        
        if (this._buttonOrder) {
            this._buttonOrder.addEventListener('click', () => {
                this.events.emit('orderForm:open');
            });
        }
        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._basketList.replaceChildren(...items);
            this.events.emit('basket:set');
            this.setDisabled(this._buttonOrder, false);
        } else {
            this._basketList.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
            this.setDisabled(this._buttonOrder, true);
        }
    }

    set totalPrice(total: number) {
        this.setText(this._totalPrice, `${total} синапсов`);
    }

    clear() {
        this.items = [];
    }
}

export class OrderView extends Component<IModalForm> {
    constructor(events: IEvents) {
        // Базовый вариант без сложных селекторов
        super(document.querySelector('.order') || document.createElement('div'));
    }
}

interface ISuccessData {
    total: number;
}

export class SuccessView extends Component<ISuccessData> {
    constructor(container?: HTMLElement) {
        // Простая и надежная инициализация
        super(container || document.createElement('div'));
    }

    set total(value: number) {
        this.container.textContent = `Заказ оформлен! Сумма: ${value} синапсов`;
    }
}