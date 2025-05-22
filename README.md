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

## Описание даных

# Слой Модели (Model)

1. Класс ProductModel

Назначение: Управление данными от товарах  и взаимодействие с API товаров

Конструктор:

- apiClient: ApiClient - клиент для работы с API
- eventEmitter: EventEmitter - брокер событий

Поля:

- products: Product[] - массив товаров
- currentProduct: Product | null - текущий выбранный товар
- isLoading: boolean - флаг загрузки данных

Методы:

- loadProducts(): Promise<void> - загружает товары с API
- getProductById(id: string): Product | undefined - возвращает товар по ID
- setCurrentProduct(id: string): void - устанавливает текущий товар

////////////////////////////

2. Класс CartModel

Назначение: Управление корзиной покупок

Конструктор:

- eventEmitter: EventEmitter - брокер событий

Поля: 

- items: CartItem[] - массив товаров в корзине
- totalPrice: number - общая стоимость товаров
- totalCount: number - общее количество товаров

Методы: 

- addItem(product: Product): void - добавляет товар в корзину
- removeItem(productId: string): void - удаляет товар из корзины
- clearCart(): void - очищает корзину
- calculateTotals(): void - пересчитывает итоговые значения

///////////////////////////

3. Класс OrderModel

Назначение: Оформление заказов

Конструктор:

- apiClient: ApiClient - клиент для работы с API
- eventEmitter: EventEmitter - брокер событий

Поля:

- currentOrder: order | null - текущий оформляемый заказ
- deliveryAddress: string - адрес доставки
- paymentMethod: Online | UponReceipt - способ оплаты
- custormerContacts: CustomerContacts - контакты покупателя

Методы:

- createOrder(cart: CartItem[]): Promise<Order> - создает новый заказ
- validateDeliveryData(): boolean - проверяет данные доставки
- validateCustomerDate(): boolean - проверяет контактные данные

# Слой Представления (View)

1. Класс ProductListView

Назначение: Отображение каталога товаров

Конструктор:

- container: HTMLElement - контейнер для рендеринга
- eventEmitter: EventEmitter - брокер событий

Элементы:

- productCards: NodeList - карточки товаров
- cartButton: HTMLElement - кнопка корзины

Методы:

- render(products: Product[]): void - отрысовывает список товаров
- showLoading(): void - показывает индикатор загрузки
- hideLoading(): void - скрывает индикатор загрузки

///////////////////////////

2. Класс ProductModalView

Назначение: Отображение модального окна с деталями товара

Конструктор:

- modalElement: HTMLElement - элемент модального окна
- eventEmitter: EventEmitter - брокер событий

Элементы:

- closeButten: HTMLElement - кнопка закрытия
- addToCartButten: HTMLElement - кнопка "Добавить в корзину"

Методы:

- show(product: Product): void - показывает модальное окно
- hide(): void - скрывает модальное окно
- updateCartButtons(isInCart: boolean): void - обновляет состояние кнопок корзины

//////////////////////////

3. Класс CartView

Назначение: Отображение корзины покупок

Конструктор:

- container: HTMLElement - контейнер для рендеринга
- eventEmitter: EventEmitter - брокер событий

Элементы:

- itemsList: HTMLElement - список товаров
- totalElement: HTMLElement - элемент с общей суммой
- checkoutButton: HTMLElement - кнопка оформления заказа

Методы:

- render(cartData: CartData): void - отрисовывает корзину
- toggleCheckoutButton(enable: boolean): void - активирует/деактивирует кнопку оформления

//////////////////////////

4. Класс CheckoutView

Назначение: Отображение процесса оформления заказа

Конструктор:

- container: HTMLElement - контейнер для рендеринга
- eventEmitter: EventEmitter - брокер событий

Элементы:

- deliveryForm: HTMLFormElement - форма доставки
- paymentForm: HTMLFormElement - форма оплаты
- nextStepButton: HTMLElement - кнопка следующего шага
- submitButton: HTMLElement - кнопка подтверждения заказа

Методы: 

- renderStep1(): void - отрисовывает первый шаг оформления
- renderStep2(): void - отрисовывает второй шаг оформления
- showCuccess(): void - показывает сообщение об успешном заказе

# Слой Презентера

Презентер будет реализован в основном скрипте приложения и будет координировать взаимодействие между моделями и представлениями через брокер событий