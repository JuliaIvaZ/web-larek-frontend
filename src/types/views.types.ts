import { IProduct } from "./app.types";

// Приведено
export interface ICard<T> {
    id: string;                 // id: ID;
    title: string;
    price: number;
    description?: string;
    image?: string;
    category?: string;
}

// Приведено
export interface ISuccessOrder {
    total: number;
}

// Приведено
export interface ISuccess {
    onClick: () => void;
}

// Приведено
export interface IModal {
    content: HTMLElement;
}

// Приведено
export interface IModalForm {
    errors: string;
    valid: boolean;
}

// Приведено
export interface ICartView {
    items: HTMLLIElement[];
    totalPrice: HTMLSpanElement;
}

export interface IModalView {
    showModal(content: HTMLElement): void;
    hideModal(): void;
}


export interface IProductView {
    getContentElement(): HTMLElement;
    render(product: IProduct): void;
}

export interface IProductListView {
    render(products: IProduct[]): void;
}

export interface ICheckoutViewStep1 {
    getContentElement(): HTMLElement;
    render(): void;
}

export interface ICheckoutViewStep2 {
    getContentElement(): HTMLElement;
    render(): void;
}

export interface ISuccessView {
    render(data: { id: string; total: number }): HTMLElement;
}