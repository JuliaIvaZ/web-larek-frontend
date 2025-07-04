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
│    │   ├── EventEmitter.ts
|    |   └── api.ts
│    │
│    ├── model/          # Все модели 
│    │   ├── AppModel.ts   # Product + Cart
│    │   └── ApiService.ts   # API
│    │
│    ├── view/           # Компоненты 
│    │   ├── Card.ts
│    │   ├── Modal.ts
│    │   ├── OrderView.ts
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

*Вынесенныт тип*

- type ID - ID карточки

*Товар в приложении*
IProduct

- id - идентификационный номер товара
- title - название товара
- description - описание товара
- image - ссылка на картинку товара
- category - категория товара
- price - цена (null для "бесценных" товаров)

*Список карточек товаров*
IProductList

- _items - массив товаров IProduct

*Категории товаров*
ProductCategory - может принимать значения 'софт-скил' | 'хард-скил' | 'дополнительное' | 'кнопка' | 'другое';

*Элемент корзины*
TCartItem

- product - собственно товар
- totalPrice - суммарная стоимость товаров в корзине

*Данные корзины*
IСartData

-  items - массив товаров в корзине
-  totalPrice - общая сумма заказа
-  totalCount - количество товаров
  
*Способы оплаты*
PaymentMethod - может принимать только два значения 'online' | 'then'

*Контакты покупателя*
ICustomerContacts - так как поля обязательные, валидация проверяется в OrderModel

- email
- phone

*Оформленный заказ*
IOrder - Создается в OrderModel при оформлении, отправляется на сервер (преобразуется в ApiOrder), обратно получаем id заказа

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

- events: IEvents - брокер событий

*Поля:*

- _items: IProdect[] - массив товаров
- preview: string | null - ID текущего товара

*Методы:*

- setItems(productArray: IProduct[]) - загрузка массива товаров
- getItems(): IProduct[] - получение всех товаров
- getProduct(id: string) - получение товара по ID
- setPreview(item: IProduct) - установка товара для preview

### 2. Класс CartModel

**Назначение:** Управление корзиной покупок

*Конструктор:*

- eevents: IEvents - брокер событий

*Поля:*

- _items: TCartItem[] - массив товаров в корзине

*Методы:* 

- addProduct(product: TCartItem) - добавление товара
- removeProduct(productId: string) - удаление товара
- clear() - очистка корзины
- getCount(): number - подсчет количества
- - getTotal(): number - расчет суммы
hasProduct(productId: string) - проверка наличия

### 3. Класс OrderModel

**Назначение:** Управление данными заказа

*Конструктор:*

- order: IOrderRequest - данные заказа
- events: IEvents - брокер событий

*Поля:*

- order: IOrderRequest - данные заказа
- formErrors: ValidationErrors - ошибки валидации

*Методы:*

- setOrderField(field, value) - изменение поля
- validateOrder() - валидация данных
- initOrder() - сброс данных

### 4. Класс UserModel

**Назначение:** Управление данными покупателя

*Конструктор:*

- order: IPrderRequest - данные заказа
- events: IEvents - брокер событий

*Поля:*

- order: IOrderRequest - данные покупателя: email, номер телефона, способ оплаты, адрес

*Методы:*

- emitChanges()
- get orderData()
- setOrderField()
- validateOrder()
- initOrder()

## Слой Представления (View)

### 1. Класс Page

**Назначение:** базовый контейнер приложения

*Конструктор:*

- container: HTMLElement
- events: IEvents

*Элементы:*

- _counter - счетчик корзины
- _gallery - контейнер каталога
- _basket - кнопка корзины

*Методы:*

- set counter() - обновление счетчика
- set catalog() - рендер каталога
- set locked() - блокировка прокрутки
  
### 2. Класс ProductCard

**Назначение:** Базовый компонент карточки товара

*Конструктор:*

- container: HTMLElement

*Элементы:*

- _id - ID товара
- _title - название товара
- _price - цена товара
- _description - описание товара
- _image - изображение товара
- _category - категория товара
- _button - кнопка

*Методы:*

- set id()
- get id()
- set title()
- set price()
- set descriprion()
- set image()
- get category()
- set category()
- setCategoryClass()
- getCategoryClass()

### 3. Класс Сard

**Назначение:** Карточка товара для отображения на главной странице

*Конструктор:*

- container: HTMLElement

### 4. Класс CardForModal

**Назначение:** Карточка товара для отобржения в модальном окне

*Конструктор:*

- container: HTMLElement

*Методы:*

- render()
- getContainer()

### 5. Класс CardForModal

**Назначение:** Карточка товара для отображения в корзине

*Конструктор:*

- container: HTMLElement

*Элементы:*

- _index - индекс продукта в корзине
- _currentIndex = 0

*Методы:*

- set index()
- get index()

### 6. Класс Modal

**Назначение:** Базовое модальное окно

*Конструктор:*

- container: HTMLElement
- events: IEvents

*Элементы:*

- _closeButton - кнопка закрытия
- _content - контейнер содержимого

*Методы:*

- open() - открытие модалки
- close() - закрытие модалки
- set content() - установка содержимого
  
### 7. Класс ModalForm

**Назначение:** Базовая форма в модальном окне

*Конструктор:*

- econtainer: HTMLFormElement
- events: IEvents

*Элементы:*

- _errorSpan - поле ошибок
- _buttonSubmit - кнопка отправки

*Методы:*

- gset valid() - валидация формы
- set errors() - отображение ошибок
- onInputChange() - обработка изменений

### 8. Класс CartView

**Назначение:** Отображение корзины

*Конструктор:*

- container: HTMLElement
- events: IEvents

*Элементы:*

- _basketList - список товаров
- _totalPrice - сумма заказа
- _buttonOrder - кнопка оформления

*Методы:*

- set items() - обновление списка
- set totalPrice() - обновление суммы
- clear() - очистка корзины

### 9. Класс SuccessView

**Назначение:** Отображение модального окна с уведомлением об успешном заказе

*Конструктор:*

- container: HTMLElement

*Элементы:*

- total - элемент разметки, отображающий сумму заказа

*Методы:*

- set total() - устанавливает стоимость заказа

## Слой API

### Класс ApiService

**Назначение:** Работа с API магазина

*Конструктор:*

- cdn: string - базовый URL CDN
- baseUrl: string - URL API
- options: RequestInit - параметры запросов

*Методы:*

- getProductsList() - получение каталога
- getProduct() - получение товара
- orderProducts() - оформление заказа
- convertImagePath() - преобразование URL изображений


## Вспомогательные классы

### 1. Класс EventEmitter

**Назначение:** Управление событиями приложения

*Методы:*

- on() - подписка на событие
- off() - отписка
- emit() - генерация события
- trigger() - создание обработчика

### 2. Класс Component

**Назначение:** Базовый компонент UI

*Методы:*

- otoggleClass() - управление классами
- setText() - установка текста
- setDisabled() - блокировка элементов
- render() - базовый рендер

## Слой Презентера

Презентер будет реализован в основном скрипте приложения и будет координировать взаимодействие между моделями и представлениями через брокер событий