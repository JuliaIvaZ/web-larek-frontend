import { EventEmitter } from './components/core/EventEmitter';
import { ApiService } from './components/model/ApiService';
import { CartModel, ProductModel, UserModel } from './components/model/AppModel';
import { Card, CardForBasket, CardForModal } from './components/view/Card';
import { Modal, ModalContacts, ModalPayment, SuccessOrder } from './components/view/Modal';
import { CartView } from './components/view/OrderView';
import { Page } from './components/view/Page';
import './scss/styles.scss';
import { IOrder, IOrderRequest, IProduct, ISuccessData, TCartItem } from './types/app.types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const api = new ApiService(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
// events.onAll(({ eventName, data }) => {
//     console.log(eventName, data);
// })

// Все шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const galleryCardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewCardTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderPaymentTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Модели данных 
const productsData = new ProductModel(events);
const basketData = new CartModel(events);
const orderData = new UserModel({
    payment: '',
    email: '',
    phone: '',
    address: ''
}, events);

// Глобальные контейнеры
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const page = new Page(document.body, events);

// Переиспользуемые части интерфейса
const basket = new CartView(cloneTemplate(basketTemplate), events);
const orderPayment = new ModalPayment(cloneTemplate(orderPaymentTemplate), events);
const orderContacts = new ModalContacts(cloneTemplate(orderContactsTemplate), events);
const success = new SuccessOrder(cloneTemplate(successTemplate), {
    onClick: () => events.emit('modal:close')
})

// Бизнес-логика
// Выводим карточки на страницу

events.on('productsList:loaded', () => {
	page.catalog = productsData._items.map((card) => {

        const cardElement = cloneTemplate<HTMLElement>(galleryCardTemplate);
        const cardInstant = new Card(cardElement, {
            onClick: () => events.emit('card:select', card)
        });
		return cardInstant.render(card);
	});

    page.counter = 0;
});

// Открываем модалку с превью карточки

events.on('card:select', (item: IProduct) => {
    const isInBasket = basketData.hasProduct(item.id);

    const previewCard = new CardForModal(
        cloneTemplate(previewCardTemplate),
        {
            onClick: () => {
                if (!isInBasket) {
                    events.emit('cardToBasket:add', item);
                }
            }
        },
        isInBasket
    );

    previewCard.render(item);
    
    modal.render({
        content: previewCard.getContainer()
    });
});

// Функция обновления содержимого корзины и значений в заказе
const updateBasket = () => {
    basket.items = basketData.items.map((card, index) => {
        const basketElement = cloneTemplate<HTMLElement>(basketCardTemplate);
        const basketItem = new CardForBasket(basketElement, {
            onClick: () => {
                events.emit('basketProduct:deleted', card);
            }
        });
        
        basketItem.index = index + 1;
        
        return basketItem.render(card);
    });
    
    page.counter = basketData.getCount();
    basket.totalPrice = basketData.getTotal();
};

// Обработчик добавления в корзину
events.on('cardToBasket:add', (item: TCartItem) => {
    basketData.addProduct(item);
    basket.clear();
    updateBasket();
});

// Обработчик удаления товара
events.on('basketProduct:deleted', (card: TCartItem) => {
    basketData.removeProduct(card.id);
    updateBasket();
});

// Открываем модалку с корзиной 
events.on('basket:open', () => {
    modal.render({
        content: basket.render()
    })
});

// Открываем модалку с формой оплаты 
events.on('orderForm:open', () => {
    // Открываем модальное окно с формой
    modal.render({
        content: orderPayment.render()
    });
});

// Открываем модалку с формой контактов 
events.on('order:submit', () => {
    modal.render({
        content: orderContacts.render()
    });
});

// Изменилось одно из полей
events.on('form:change', (data: { field: keyof IOrderRequest, value: string }) => {
    orderData.setOrderField(data.field, data.value);
});

// Валидация полей формы
events.on('order:changed', (data: {field: keyof IOrderRequest}) => {
    if (data.field === 'payment' || data.field === 'address') {
        const { payment, address } = orderData.validateOrder();
        const valid = !address && !payment;
        const errors = Object.values({address, payment}).filter(i => !!i).join('; ');

        orderPayment.render({
            address: orderData.order.address,
            payment: orderData.order.payment,
            valid: valid,
            errors: errors,
        })
    } else {
        const { email, phone } = orderData.validateOrder();
        const valid = !email && !phone;
        const errors = Object.values({email, phone}).filter(i => !!i).join('; ');

        orderContacts.render({
            email: orderData.order.email,
            phone: orderData.order.phone,
            valid: valid,
            errors: errors,
        })
    }
})

// Обновляем обработчик завершения заказа

events.on('contacts:submit', () => {
    const orderDataComplete: IOrder = {
        ...orderData.orderData,
        total: basketData.getTotal(),
        items: basketData.getProductIds(),
    }

    
    api.orderProducts(orderDataComplete)
        .then((response) => {
            
            // Успешная обработка
            handleSuccess(response);
        })
        .catch((error) => {
            
            // Обработка разных типов ошибок
            if (error.status === 400) {
                handleValidationError(error);
            } else if (error.status === 500) {
                handleServerError();
            } else {
                handleGenericError();
            }
        });

    function handleSuccess(res: ISuccessData) {
        // Логика при успешной отправке
        modal.render({
            content: success.render(res)
        });
        success.totalPayed = res.total;
        basketData.clear();
        updateBasket();
        page.counter = 0;
    }

    function handleValidationError(error: any) {
        // Обработка ошибок валидации
        console.log('Ошибка валидации:', error.errors);
    }

    function handleServerError() {
        // Обработка ошибок сервера
        console.log('Произошла ошибка на сервере');
    }

    function handleGenericError() {
        // Общая обработка ошибок
        console.log('Неизвестная ошибка');
    }
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});

api.getProductsList()
    .then((productsList) => {
        productsData.setItems(productsList._items);
    })
    .catch((err) => {
        console.log('Ошибка при получении данных:', err);
    });

    // инициируем данные для заказа
    orderData.initOrder();