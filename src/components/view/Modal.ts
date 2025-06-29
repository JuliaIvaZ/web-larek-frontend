import { IContactsForm, IPaymentForm } from "../../types/app.types";
import { IModal, ISuccess, ISuccessOrder } from "../../types/views.types";
import { ensureElement } from "../../utils/utils";
import { Component, ModalForm } from "../core/Component";
import { IEvents } from "../core/EventEmitter";

// Приведено
export class Modal extends Component<IModal> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close() {
        this.container.classList.remove('modal_active');
        this._content.replaceChildren();
        this.events.emit('modal:close');
    }
    
    render(data: IModal): HTMLElement {
        super.render(data);

        this.open();
        return this.container;
    }
}

// Приведено
export class SuccessOrder extends Component<ISuccessOrder> {
    protected _closeButton: HTMLElement;
    protected _totalPayed: HTMLParagraphElement;

    constructor(container: HTMLElement, actions: ISuccess) {
        super(container);

        this._closeButton = ensureElement<HTMLElement>('.order-success__close', this.container);
        this._totalPayed = ensureElement<HTMLParagraphElement>('.order-success__description', this.container)

        if (actions?.onClick) {
            this._closeButton.addEventListener('click', actions.onClick);
        }
    }

    set totalPayed(total: number) {
        this.setText(this._totalPayed, `Списано ${total} синапсов`);
    }
    
    getContainer(): HTMLElement {
        return this.container;
    }
}

// Приведено
export class ModalPayment extends ModalForm<IPaymentForm> {
    private _paymentButtons: NodeListOf<HTMLButtonElement>;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        
        // Получаем все кнопки оплаты
        this._paymentButtons = this.container.querySelectorAll('.order__buttons button');
        
        // Добавляем обработчики кликов на кнопки
        this._paymentButtons.forEach(button => {
            button.addEventListener('click', (evt) => {
                this.onInputChange('payment', button.name);
            });
        });
    }

    // Метод для переключения активных кнопок
    set payment(value: string) {
        this._paymentButtons.forEach(button => {
            this.toggleClass(button, 'button_alt-active', button.name === value);
        })
    }

    // Дополнительные сеттеры для работы с формой
    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}

// Приведено
export class ModalContacts extends ModalForm<IContactsForm> {
    
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    // Дополнительные сеттеры для работы с формой
    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }
}