import { ID } from "./app.types";

export interface ICard<T> {
    id: ID;                 
    title: string;
    price: number;
    description?: string;
    image?: string;
    category?: string;
}

export interface ISuccessOrder {
    total: number;
}

export interface ISuccess {
    onClick: () => void;
}

export interface IModal {
    content: HTMLElement;
}

export interface IModalForm {
    errors: string;
    valid: boolean;
}

export interface ICartView {
    items: HTMLLIElement[];
    totalPrice: HTMLSpanElement;
}

