
export type ID = string;

export type ProductCategory = 'софт-скил' | 'хард-скил' | 'дополнительное' | 'кнопка' | 'другое';

export interface IProductsList {
    _items: IProduct[];
}
export interface IProduct {
    id: ID;                     // сохраняется в preview IProductsList
    title: string;
    description: string;
    image: string;
    category: ProductCategory;
    price: number | null;
}

export interface IOrder { // данные, уходящие к серверу для оформления заказа
    payment: string;      
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export interface IOrderRequest { // данные, уходящие к серверу для оформления заказа
    payment: string;
    email: string;
    phone: string;
    address: string;
}

export type TCartItem = Pick<IProduct, 'id' | 'title' | 'price'>;

export type ValidationErrors = Partial<Record<keyof IOrderRequest, string>>;

export interface IProductModel {
    _items: IProduct[];
    setItems(products: IProduct[]): void;  
    getItems(): IProduct[];                 
    getProduct(productId: string): IProduct | undefined;
}

export interface ICartModel {
    items: TCartItem[];
    addProduct(product: IProduct): void;
    removeProduct(productId: string): void;   
    clear(): void;
    getCount(): number;
    getTotal(): number;
    hasProduct(productId: string): boolean;
}

export interface IOrderModel {
    order: IUserOrder;
    validateOrder(): FormErrors;
    initOrder(): void;
    setOrderField(field: keyof IUserOrder, value: string): void;
}

export interface IPaymentForm {
    payment: string;
    address: string;
}

export interface IContactsForm {
    email: string;
    phone: string;
}

export interface IOrderPayment extends IPaymentForm {
    items: string[];
}

export interface IOrderContacts extends IContactsForm {
    items: string[];
}

export interface ISuccessData {
    id: ID;                
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
