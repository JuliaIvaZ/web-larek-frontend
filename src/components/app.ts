import { IProduct } from "../types/app.types";
import { ICard } from "../types/views.types";
import { API_URL, CDN_URL } from "../utils/constants";
import { ApiClient } from "./core/api";
import { EventEmitter } from "./core/EventEmitter";
import { CartModel, ProductModel } from "./model/AppModel";
import { CatalogView, ModalView, ProductModal } from "./view/Modal";

export class App {
    private modalView: ModalView;
    private modalTemplate: HTMLTemplateElement;
    private apiClient: ApiClient;
    private productModel: ProductModel;
    private catalogView: CatalogView;
    private events: EventEmitter;

    private cartModel: CartModel;
    private productCards: ICard[] = [];

    constructor() {
        try {
            // 1. Проверяем обязательные элементы перед инициализацией
            this.checkTemplates();
            
            // 2. Инициализация сервисов
            this.events = new EventEmitter();
            this.apiClient = new ApiClient(CDN_URL, API_URL);
            this.productModel = new ProductModel(this.apiClient);
            this.cartModel = new CartModel(this.events);

            // 3. Инициализация представлений с безопасными проверками
            this.initViews();

            this.setupEventListeners();
            
            // 4. Запуск приложения
            this.init().catch(console.error);
            
        } catch (error) {
            console.error('Ошибка инициализации приложения:', error);
        }
    }

    private checkTemplates() {
        const requiredTemplates = [
            '#card-catalog',
            '#card-preview'
        ];
        
        requiredTemplates.forEach(id => {
            if (!document.querySelector(id)) {
                throw new Error(`Не найден обязательный шаблон: ${id}`);
            }
        });
    }

    private initViews() {
        // Галерея
        const galleryContainer = document.querySelector('.gallery');
        if (!galleryContainer) throw new Error('Не найден .gallery');
        
        this.catalogView = new CatalogView(
            galleryContainer as HTMLElement,
            this.events
        );

        // Модальное окно
        const modalContainer = document.querySelector('#modal-container');
        if (!modalContainer) throw new Error('Не найден #modal-container');
        
        this.modalView = new ModalView(
            modalContainer as HTMLElement,
            this.events
        );

        // Шаблон для модалки товара
        this.modalTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
    }

    private async init() {
        try {
            await this.productModel.loadProducts();
            const products = this.productModel.getProducts();
            
            // Безопасный рендеринг
            if (this.catalogView) {
                this.catalogView.render(products);
            } else {
                console.error('CatalogView не инициализирован');
            }
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
        }
    }

    private setupEventListeners() {
        // 1. Событие выбора товара
        this.events.on('product:selected', (data: { product: IProduct }) => {
            this.openProductModal(data.product);
        });

        // 2. События модального окна
        this.events.on('modal:open', () => {
            document.body.classList.add('page__wrapper_locked');
        });

        this.events.on('modal:close', () => {
            document.body.classList.remove('page__wrapper_locked');
        });
    }

    private openProductModal(product: IProduct) {
        try {
            // 1. Клонируем шаблон
            const modalContent = document.importNode(this.modalTemplate.content, true);
            const modalElement = modalContent.firstElementChild as HTMLElement;
            
            if (!modalElement) {
                throw new Error('Шаблон модального окна пустой');
            }

            // 2. Заполняем данные
            this.fillModalContent(modalElement, product);

            // 3. Показываем модальное окно
            this.modalView.showModal(modalElement);

        } catch (error) {
            console.error('Ошибка открытия модального окна:', error);
        }
    }

    private fillModalContent(container: HTMLElement, product: IProduct) {
        const setTextContent = (selector: string, value: string) => {
            const el = container.querySelector(selector);
            if (el) el.textContent = value;
        };

        setTextContent('.card__title', product.title);
        setTextContent('.card__text', product.description || '');
        setTextContent('.card__price', product.price ? `${product.price} синапсов` : 'Бесценно');

        const img = container.querySelector('.card__image') as HTMLImageElement;
        if (img) {
            img.src = product.imageUrl;
            img.alt = product.title;
        }

        const button = container.querySelector('.card__button');
        if (button) {
            button.addEventListener('click', () => {
                this.cartModel.addItem(product);
                this.modalView.close();
            });
        }
    }
}

