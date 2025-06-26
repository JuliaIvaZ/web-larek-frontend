import { Product } from "../types/models";
import { IEvents } from "./base/events";

export class DataBasket {
    private products: Product[] = [];
    private eventsHub: IEvents

    constructor(eventsHub: IEvents) {
    this.eventsHub = eventsHub
     }

    addProduct(product: Product): void {
    this.products.push(product);
    this.eventsHub.emit('basket:changed');
     }

    removeProduct(product: Product): void {
    this.products = this.products.filter(p => p.id !== product.id);
    this.eventsHub.emit('basket:changed');
     }

    getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
     }

    get total(): number {
    return this.products.length;
     }

    get all(): Product[] {
    return [...this.products];
     }
}