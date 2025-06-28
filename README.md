# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

Обновленная структура проекта: 
src/
├── components/
│    ├── types/          # Типизация 
│    │   ├── api.types.ts
│    │   ├── app.types.ts
│    │   └── views.types.ts
│    │
│    ├── core/           # Базовые классы
│    │   ├── Component.ts
│    │   └── EventEmitter.ts
│    │
│    ├── model/          # Все модели 
│    │   ├── AppModel.ts   # Product + Cart
│    │   └── ApiService.ts   # API
│    │
│    ├── view/           # Компоненты 
│    │   ├── Card.ts
│    │   ├── Modal.ts
│    │   └── Page.ts
│    │
│    └── app.ts          # Инициализация
└── index.ts

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

# Описание данных

## Интерфейсы

### Типы данных приложения

*Товар в приложении*
Product

- id - идентификационный номер товара
- title - название товара
- description - описание товара
- imageURL - ссылка на картинку товара
- category - категория товара
- price - цена

*Категории товаров*
ProductCategory - может принимать значения 'софт-скил' | 'хард-скил' | 'дополнительное' | 'кнопка' | 'другое';

*Элемент корзины*
CartItem

- product - собственно товар
- totalPrice - суммарная стоимость товаров в корзине

*Состояние корзины*
СartData

- items
-  totalPrice
-  totalCount
  
*Способы оплаты*
PaymentMethod - может принимать только два значения 'online' | 'then'

*Контакты покупателя*
CustomerContacts - так как поля обязательные, валидация проверяется в OrderModel

- email
- phone

*Оформленный заказ*
Order - Создается в OrderModel при оформлении, отправляется на сервер (преобразуется в ApiOrder), обратно получаем id заказа

- id
- item
- paymentMethod
- castomerContact
- total
- status

### Типы данных API

ApiProduct - получаем с сервера при загрузке каталога товаров, затем в ProductModel преобразуем в локальный тип Product

- id
- title
- description
- image
- category
- price

*Элемент корзины с сервера*
ApiCartItem - в CartModel преобразуем в локальный тип CartItem

- productId
- priceSnapshot - цена на момент добавления товара

*Данные заказа с сервера*
ApiOrder - данные, которые отправляются на сервер при оформлении

- id
- item
- deliveryAddress
- paymentMethod
- customerContacts
- total
- status

*Интерфейс API-клиента*
IApiClient - описывает возможные API-запросы, их параметры и возвращаемые данные

- getProducts - получение списка товаров. На выходе получаем массив ApiProducts
- getProductById - получение конкретного товара по его id
- addToCart - добавление товара в корзину. На выходе получаем ApiCartItem
- removeFromCart - удаление товара из корзины
- createOrder - создание заказа. На выходе получаем ApiOrder

### Интерфейсы моделей

*Модель товара*
IProductModel - управляет данными о товарах: загрузкой, поиском, текущем выбранным товаром

- getProducts() - возвращает массив уже загруженных и преобразованных в Product товаров при открытии главной страницы при успешной загрузке данных с сервера
- getProductById(id) - возвращает товар по его ID 
- setCurrentProduct(id) - устанавливает текущий выбранный товар, например, для отображения в модальном окне

*Модель корзины*
ICartModel - управляет товарами в корзине: добавлением, удалением, подсчетом итогового количества и цены

- items - содержит массив элементов корзины CartItem
- totalPrice
- addItem - проверяет, есть ли товар в items, если нет - добавляет новый CartItem и обновляет totalCount и totalPrice. На вход получает product
- removeItem - удаляет товар из корзины. На вход получает product
- clear - полностью очищает корзину после оформления заказа

*Модель заказа*
IOrderModel - отвечает за оформление заказа и валидацию данных

- createOrder - имеет на входе массив товаров в корзине CartItem отпавляет данные заказа на сервер и возвращает объект Order с id и статусом заказа
- validateDeliveryData - проверяет заполненность обязательных полей доставки (адрес и способ оплаты)
- validateCustomerData - проверяет заполненность обязательных полей контактов (email и телефон)

### Интерфейсы представлений

*Интерфейс для списка товаров*
IProductListView - отвечает за отображение каталога товаров на главной странице

- render - отрисовывает список товаров Products на основе переданных данных

*Интерфейс модального окна*
IModalView - отвечает за открытие и закрытие модального окна с переданными данными

- showModal - открывает модальное окно
- hideModal - закрывает модальное окно по клику на крестик или вне окна

*Интефрейс окна товара*
IProductView - отвечает за отображение подробной информации о товаре и взаимодействие с корзиной

- getContentElement - возвращает элемент разметки
- render - отрисовывает информацию о товаре

*Представление корзины*
ICartView - отвечает за отображение корзины и кнопки оформления заказа

- getContentElement - возвращает элемент разметки
- render - отрисовывает корзину на основе данных cardData, вызывается при открытии корзины и после добавления/удаления товара
- toggleCheckOutButton - активирует/деактивирует кнопку оформления заказа
- totalPrice - считает суммарную стоимость товаров в корзине

*Представление оформления заказа*
ICheckoutViewStep1 - управляет отображением 1 шага оформления заказа

- getContentElement - возвращает элемент разметки
- render - показывает первый шаг оформления - форма ввода адреса доставки и выбор способа оплаты

*Представление оформления заказа*
ICheckoutViewStep2 - управляет отображением 2 шага оформления заказа

- getContentElement - возвращает элемент разметки
- render - показывает второй шаг оформления - форма ввода емейла и телефона

## Слой Модели (Model)

### 1. Класс ProductModel

**Назначение:** Управление данными от товарах  и взаимодействие с API товаров

*Конструктор:*

- apiClient: ApiClient - клиент для работы с API
- eventEmitter: EventEmitter - брокер событий

*Поля:*

- products: Product[] - массив товаров
- currentProduct: Product | null - текущий выбранный товар
- isLoading: boolean - флаг загрузки данных

*Методы:*

- loadProducts(): Promise<void> - загружает товары с API
- getProductById(id: string): Product | undefined - возвращает товар по ID
- setCurrentProduct(id: string): void - устанавливает текущий товар

### 2. Класс CartModel

**Назначение:** Управление корзиной покупок

*Конструктор:*

- eventEmitter: EventEmitter - брокер событий

*Поля:*

- items: CartItem[] - массив товаров в корзине
- totalPrice: number - общая стоимость товаров

*Методы:* 

- addItem(product: Product): void - добавляет товар в корзину
- removeItem(productId: string): void - удаляет товар из корзины
- clearCart(): void - очищает корзину
- calculateTotals(): void - пересчитывает итоговые значения

### 3. Класс OrderModel

**Назначение:** Оформление заказов

*Конструктор:*

- apiClient: ApiClient - клиент для работы с API
- eventEmitter: EventEmitter - брокер событий

*Поля:*

- deliveryAddress: string - адрес доставки
- paymentMethod: Online | UponReceipt - способ оплаты
- custormerContacts: CustomerContacts - контакты покупателя

*Методы:*

- createOrder(cart: CartItem[], totalPrice: number): Promise<Order> - создает новый заказ
- validateDeliveryData(): boolean - проверяет данные доставки
- validateCustomerDate(): boolean - проверяет контактные данные

## Слой Представления (View)

### 1. Класс ProductListView

**Назначение:** Отображение каталога товаров

*Конструктор:*

- container: HTMLElement - контейнер для рендеринга
- eventEmitter: EventEmitter - брокер событий

*Элементы:*

- productCards: HTMLElement - элемент разметки, отображающий список товаров
- cartButton: HTMLElement - кнопка корзины

*Методы:*

- render(elementsList: HTMLElements[]): void - отрысовывает список товаров
  
### 2. Класс ModalView

**Назначение:** Отображение универсального модального окна

*Конструктор:*

- modalElement: HTMLElement - элемент модального окна
- eventEmitter: EventEmitter - брокер событий

*Элементы:*

- closeButton: HTMLElement - кнопка закрытия

*Методы:*

- showModal(content: HTMLElement): void - открывает модальное окно
- hideModal(): void - скрывает модальное окно

### 3. Класс ProductView

**Назначение:** Отображение карточки товара

*Конструктор:*

- eventEmitter: EventEmitter - брокер событий

*Элементы:*

- rootElement: HTMLElement - контейнер карточки товара
- addToCartButton: HTMLElement - кнопка добавления товара в корзину

*Методы:*

- getContentElement(): HTMLElement - возвращает элемент разметки для передачи в модальное окно
- render(product: Product) - отрисовывает данные товара
  
### 4. Класс CartView

**Назначение:** Отображение корзины покупок

*Конструктор:*

- eventEmitter: EventEmitter - брокер событий

*Элементы:*

- rootElement: HTMLElement - контейнер корзины
- itemsList: HTMLElement - список товаров
- totalElement: HTMLElement - элемент с общей суммой
- checkoutButton: HTMLElement - кнопка оформления заказа

*Методы:*

- getContentElement(): HTMLElemtnt - возвращает DOM-элемент корзины для передачи в модальное окно
- render(cartData: CartData): void - отрисовывает корзину
- toggleCheckoutButton(enable: boolean): void - активирует/деактивирует кнопку оформления
- totalPrice(): number - считает общую сумму заказа

### 5. Класс CheckoutViewStep1

**Назначение:** Отображение первого шага процесса оформления заказа

*Конструктор:*

- eventEmitter: EventEmitter - брокер событий

*Элементы:*

- rootElement: HTMLElement - контейнер первого шага оформления заказа
- deliveryForm: HTMLFormElement - форма доставки
- paymentForm: HTMLFormElement - форма оплаты
- nextStepButton: HTMLElement - кнопка следующего шага

*Методы:*

- getContentElement(): HTMLElement - возвращает DOM-элемент первого шага оформления заказа для передачи в модальное окно
- render(): void - отрисовывает первый шаг оформления

### 6. Класс CheckoutViewStep2

**Назначение:** Отображение второго шага процесса оформления заказа

*Конструктор:*

- eventEmitter: EventEmitter - брокер событий

*Элементы:*

- rootElement: HTMLElement - контейнер второго шага оформления заказа
- emailForm: HTMLFormElement - форма ввода email
- phoneNumberForm: HTMLFormElement - форма ввода номера телефона
- submitButton: HTMLElement - кнопка завершения заказа

*Методы:*

- getContentElement(): HTMLElement - возвращает DOM-элемент первого шага оформления заказа для передачи в модальное окно
- render(): void - отрисовывает второй шаг оформления


## Слой Презентера

Презентер будет реализован в основном скрипте приложения и будет координировать взаимодействие между моделями и представлениями через брокер событийÍ