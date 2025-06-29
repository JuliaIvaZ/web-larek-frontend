import { IApiClient, IApiProduct } from "./api.types";

export type ID = string;

export type ProductCategory = 'софт-скил' | 'хард-скил' | 'дополнительное' | 'кнопка' | 'другое';
// Приведено
export interface IProductsList {
    _items: IProduct[];
}
// Приведено
export interface IProduct {
    id: string;                     // id: ID; // сохраняется в preview IProductsList
    title: string;
    description: string;
    imageUrl: string;
    category: ProductCategory;
    price: number | null;
}

// Приведено
export interface IOrder { // данные, уходящие к серверу для оформления заказа
    payment: string;        //payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

// Приведено
export interface IOrderRequest { // данные, уходящие к серверу для оформления заказа
    payment: string;
    email: string;
    phone: string;
    address: string;
}

// Приведено
export type TCartItem = Pick<IProduct, 'id' | 'title' | 'price'>;

// Приведено
export type ValidationErrors = Partial<Record<keyof IOrderRequest, string>>;

// Приведено
export interface IProductModel {
    _items: IProduct[];
    setItems(products: IProduct[]): void;    //setItems(productArray: IProduct[]): void;
    getItems(): IProduct[];                  //getItems(): IProduct[];
    getProduct(productId: string): IProduct | undefined;
}

// Приведено
export interface ICartModel {
    items: TCartItem[];
    addProduct(product: IProduct): void;
    removeProduct(productId: string): void;     //deleteProduct(productId: string): void;
    clear(): void;
    getCount(): number;
    getTotal(): number;
    hasProduct(productId: string): boolean;
}

// Приведено
export interface IOrderModel {
    order: IUserOrder;
    validateOrder(): FormErrors;
    initOrder(): void;
    setOrderField(field: keyof IUserOrder, value: string): void;
}

// Приведено
export interface IPaymentForm {
    payment: string;
    address: string;
}

// Приведено
export interface IContactsForm {
    email: string;
    phone: string;
}

// Приведено
export interface IOrderPayment extends IPaymentForm {
    items: string[];
}

// Приведено
export interface IOrderContacts extends IContactsForm {
    items: string[];
}

// Приведено
export interface ISuccessData {
    id: string;                 // id: ID;
    total: number;
} 
export type PaymentMethod = 'online' | 'cash';
export interface ICustomerContacts {
    email: string;
    phone: string;
}
export type FormErrors = Partial<Record<keyof IUserOrder, string>>;
interface IUserOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
}

export interface IOrderForm {
    payment: string;
    address: string;
    email: string;
    phone: string;
    valid: boolean;
    errors: string;
}

export interface ISuccessData {
    total: number;
}

export interface ICurrentOrder {
    address?: string;
    paymentMethod?: PaymentMethod;
    customerContacts?: ICustomerContacts;
}