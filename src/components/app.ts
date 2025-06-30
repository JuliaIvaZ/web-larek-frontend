import { IOrder, IOrderRequest, IProduct, ISuccessData, TCartItem } from "../types/app.types";
import { API_URL, CDN_URL } from "../utils/constants";
import { cloneTemplate, ensureElement } from "../utils/utils";
import { EventEmitter } from "./core/EventEmitter";
import { ApiService } from "./model/ApiService";
import { CartModel, ProductModel, UserModel } from "./model/AppModel";
import { Card, CardForBasket, CardForModal } from "./view/Card";
import { Modal, ModalContacts, ModalPayment, SuccessOrder } from "./view/Modal";
import { CartView } from "./view/OrderView";
import { Page } from "./view/Page";

export class App {

    private events: EventEmitter; // = new EventEmitter();
    private api: ApiService; // = new ApiService(CDN_URL, API_URL);

    // Модели данных 
    private productsData: ProductModel; // = new ProductModel(this.events);
    private basketData: CartModel; // = new CartModel(this.events);
    private orderData: UserModel; // = new UserModel({

    // Все шаблоны
    private successTemplate: HTMLTemplateElement; // = ensureElement<HTMLTemplateElement>('#success');
    private galleryCardTemplate: HTMLTemplateElement; // = ensureElement<HTMLTemplateElement>('#card-catalog');
    private previewCardTemplate: HTMLTemplateElement; // = ensureElement<HTMLTemplateElement>('#card-preview');
    private basketCardTemplate: HTMLTemplateElement; // = ensureElement<HTMLTemplateElement>('#card-basket');
    private basketTemplate: HTMLTemplateElement; // = ensureElement<HTMLTemplateElement>('#basket');
    private orderPaymentTemplate: HTMLTemplateElement; // = ensureElement<HTMLTemplateElement>('#order');
    private orderContactsTemplate: HTMLTemplateElement; // = ensureElement<HTMLTemplateElement>('#contacts');

    // Представления:
    // - Глобальные контейнеры
    private modal: Modal; // = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
    private page: Page; // = new Page(document.body, events);
    // - Переиспользуемые части интерфейса
    private basket: CartView; // = new CartView(cloneTemplate(basketTemplate), events);
    private orderPayment: ModalPayment; // = new ModalPayment(cloneTemplate(orderPaymentTemplate), events);
    private orderContacts: ModalContacts; // = new ModalContacts(cloneTemplate(orderContactsTemplate), events);
    private success: SuccessOrder; // = new SuccessOrder(cloneTemplate(successTemplate), {


    constructor() {
        this.initComponents();
        this.initEventhandler();
        this.loadData();
    }

    private initComponents(): void {
        this.events = new EventEmitter();
        this.api = new ApiService(CDN_URL, API_URL);

        // Инициализация шаблонов
        this.successTemplate = ensureElement<HTMLTemplateElement>('#success');
        this.galleryCardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
        this.previewCardTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
        this.basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
        this.basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
        this.orderPaymentTemplate = ensureElement<HTMLTemplateElement>('#order');
        this.orderContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

        // Инициализация моделей
        this.productsData = new ProductModel(this.events);
        this.basketData = new CartModel(this.events);
        this.orderData = new UserModel({
            payment: '',
            email: '',
            phone: '',
            address: ''
        }, this.events);

        // Инициализация представлений
        this.modal = new Modal(ensureElement<HTMLElement>('#modal-container'), this.events);
        this.page = new Page(document.body, this.events);
        this.basket = new CartView(cloneTemplate(this.basketTemplate), this.events);
        this.orderPayment = new ModalPayment(cloneTemplate(this.orderPaymentTemplate), this.events);
        this.orderContacts = new ModalContacts(cloneTemplate(this.orderContactsTemplate), this.events);
        this.success = new SuccessOrder(cloneTemplate(this.successTemplate), {
            onClick: () => this.events.emit('modal:close')
        });
    }

    private initEventhandler(): void {
        // Обработчики события
        this.events.on('productsList:loaded', this.handleProductsLoaded.bind(this));
        this.events.on('card:select', this.handleCardSelect.bind(this));
        this.events.on('cardToBasket:add', this.handleAddToBasket.bind(this));
        this.events.on('basketProduct:deleted', this.handleRemoveFromBasket.bind(this));
        this.events.on('basket:open', this.handleOpenBasket.bind(this));
        this.events.on('orderForm:open', this.handleOpenOrderForm.bind(this));
        this.events.on('order:submit', this.handleOrderSubmit.bind(this));
        this.events.on('form:change', this.handleFormChange.bind(this));
        this.events.on('order:changed', this.handleOrderChanged.bind(this));
        this.events.on('contacts:submit', this.handleContactsSubmit.bind(this));
        this.events.on('modal:open', () => this.page.locked = true);
        this.events.on('modal:close', () => this.page.locked = false);
    }

    private loadData(): void {
        this.api.getProductsList()
        .then((productsList) => {
            this.productsData.setItems(productsList._items);
        })
        .catch((err) => {
            console.log('Ошибка при получении данных:', err);
        });

        this.orderData.initOrder();
    }

    // Обработчики событий
    private handleProductsLoaded(): void {
        this.page.catalog = this.productsData._items.map((card) => {

            const cardElement = cloneTemplate<HTMLElement>(this.galleryCardTemplate);
            const cardInstant = new Card(cardElement, {
                onClick: () => this.events.emit('card:select', card)
            });
	    	return cardInstant.render(card);
	    });

        this.page.counter = 0;
    }
    // Открываем модалку с превью карточки
    private handleCardSelect(item: IProduct): void {
        const isInBasket =this.basketData.hasProduct(item.id);

        const previewCard = new CardForModal(
            cloneTemplate(this.previewCardTemplate),
            {
                onClick: () => {
                    if (!isInBasket) {
                        this.events.emit('cardToBasket:add', item);
                    }
                }
            },
            isInBasket
        );

        previewCard.render(item);
    
        this.modal.render({
            content: previewCard.getContainer()
        });
    }

    // Функция обновления содержимого корзины и значений в заказе
    private updateBasket(): void {
            this.basket.items = this.basketData.items.map((card, index) => {
                const basketElement = cloneTemplate<HTMLElement>(this.basketCardTemplate);
                const basketItem = new CardForBasket(basketElement, {
                    onClick: () => {
                        this.events.emit('basketProduct:deleted', card);
                    }
                });
            
                basketItem.index = index + 1;
            
                return basketItem.render(card);
            });
        
            this.page.counter = this.basketData.getCount();
                this.basket.totalPrice = this.basketData.getTotal();
    };

    // Обработчик добавления в корзину
    private handleAddToBasket(item: IProduct): void {
        this.basketData.addProduct(item);
        this. basket.clear();
        this.updateBasket();
    }

    // Обработчик удаления товара
    private handleRemoveFromBasket(card: TCartItem): void {
        this.basketData.removeProduct(card.id);
        this.updateBasket();
    }

    // Открываем модалку с корзиной 
    private handleOpenBasket(): void {
        this.modal.render({
            content: this.basket.render()
        })
    }

    // Открываем модалку с формой оплаты 
    private handleOpenOrderForm(): void {
        this.modal.render({
            content: this.orderPayment.render()
        });
    }

    // Открываем модалку с формой контактов 
    private handleOrderSubmit(): void {
        this.modal.render({
            content: this.orderContacts.render()
        });
    }

    // Изменилось одно из полей
    private handleFormChange(data: { field: keyof IOrderRequest, value: string }): void {
        this.orderData.setOrderField(data.field, data.value);
    }

    // Валидация полей формы
    private handleOrderChanged(data: {field: keyof IOrderRequest}): void {
        if (data.field === 'payment' || data.field === 'address') {
            const { payment, address } = this.orderData.validateOrder();
            const valid = !address && !payment;
            const errors = Object.values({address, payment}).filter(i => !!i).join('; ');

            this.orderPayment.render({
                address: this.orderData.order.address,
               payment: this.orderData.order.payment,
               valid: valid,
               errors: errors,
           })
        } else {
            const { email, phone } = this.orderData.validateOrder();
            const valid = !email && !phone;
            const errors = Object.values({email, phone}).filter(i => !!i).join('; ');

            this.orderContacts.render({
                email: this.orderData.order.email,
                phone: this.orderData.order.phone,
                valid: valid,
                errors: errors,
            })
        }
    }

    // Обновляем обработчик завершения заказа
    private handleContactsSubmit() {
        const orderDataComplete: IOrder = {
            ...this.orderData.orderData,
            total: this.basketData.getTotal(),
            items: this.basketData.getProductIds(),
        }

        this.api.orderProducts(orderDataComplete)
        .then((response) => this.handleSuccess(response))
        .catch((error) => this.handleError(error));
    };
    
    private handleSuccess(res: ISuccessData): void {
        this.modal.render({
            content: this.success.render(res)
        });
        this.success.totalPayed = res.total;
        this.basketData.clear();
        this.updateBasket();
        this.page.counter = 0;
    }

    private handleError(error: any): void {
        if (error.status === 400) {
            console.log('Ошибка валидации:', error.errors);
        } else if (error.status === 500) {
            console.log('Произошла ошибка на сервере');
        } else {
            console.log('Неизвестная ошибка');
        }
    }
}