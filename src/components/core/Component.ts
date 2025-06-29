import { IModalForm } from "../../types/views.types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "./EventEmitter";

/**
 * Базовый компонент
 */
export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) {
        // Учитывайте что код в конструкторе исполняется ДО всех объявлений в дочернем классе
    }

    // Инструментарий для работы с DOM в дочерних компонентах

    // Переключить класс
    toggleClass(element: HTMLElement, className: string, force?: boolean) {
        element.classList.toggle(className, force);
    }

    // Установить текстовое содержимое
    protected setText(element: HTMLElement, value: unknown) {
        if (element) {
            element.textContent = String(value);
        }
    }

    // Сменить статус блокировки
    setDisabled(element: HTMLElement, state: boolean) {
        if (element) {
            if (state) element.setAttribute('disabled', 'disabled');
            else element.removeAttribute('disabled');
        }
    }

    // Скрыть
    protected setHidden(element: HTMLElement) {
        element.style.display = 'none';
    }

    // Показать
    protected setVisible(element: HTMLElement) {
        element.style.removeProperty('display');
    }

    // Установить изображение с алтернативным текстом
    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    // Вернуть корневой DOM-элемент
    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}

export abstract class ModalForm<T> extends Component<IModalForm> {
    protected _errorSpan: HTMLElement;
    protected _buttonSubmit: HTMLButtonElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._buttonSubmit = ensureElement<HTMLButtonElement>('.button[type=submit]', this.container);
        this._errorSpan = ensureElement<HTMLElement>('.form__errors', this.container);
        

        this.container.addEventListener('input', (evt: Event) => {
            const target = evt.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (evt: Event) => {
            evt.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`form:change`, {
            field,
            value
        });
    }

    set valid(value: boolean) {
        this._buttonSubmit.disabled = !value;
    }

    set errors(value: string) {
        this.setText(this._errorSpan, value);
    }
    
    render(state?: Partial<T & IModalForm>) {
        if (!state) {
            return this.container;
        }

        const {valid, errors, ...inputs} = state;

        super.render({valid, errors});
        
        Object.assign(this, inputs);
        return this.container;

    }
}