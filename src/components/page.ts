import { Component } from './base/component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

interface IPage {
    counter: number;            // Число для счетчика корзины
    catalog: HTMLElement[];     // Массив DOM-элементов (товары в каталоге)
    locked: boolean;            // Флаг блокировки страницы (для скролла)
}

export class Page extends Component<IPage> {
    protected _counter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;


    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._catalog = ensureElement<HTMLElement>('.card-catalog');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basket = ensureElement<HTMLElement>('.header__basket');

        // На кнопку корзины (_basket) вешается обработчик клика, который эмитирует 
        // событие 'bids:open' (открытие корзины)
        this._basket.addEventListener('click', () => {
            this.events.emit('bids:open');
        });
    }

    // Обновляем счетчик корзины
    //set counter(value: number) {
    //    this.setText(this._counter, String(value));
   // }

    // Обновляем каталог
    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    // Блокировка/разблокировка прокрутки страницы
    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}