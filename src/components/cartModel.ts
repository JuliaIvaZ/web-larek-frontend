import { IProduct } from "../types/models";
import { IEvents } from "./base/events";

export class CartModel {
    private items: IProduct[] = [];
    private events: IEvents

    constructor(events: IEvents) {
        this.events = events;
    }

    addItem(item: IProduct): void {
        if (!this.hasItem(item.id)) {
            this.items.push(item);
            this.events.emit('cart:updated', { items: this.items });
        }
    }

    removeItem(id: string): void {
        this.items = this.items.filter(currentItem => currentItem.id !== id);
        this.events.emit('cart:updated', { items: [...this.items ]});
    }

    hasItem(id: string): boolean {
        return this.items.some(item => item.id === id);
    }

    getItems(): IProduct[] {
        return [...this.items];
    }

    clear(): void {
        this.items = [];
        this.events.emit('cart:updated', { items: this.items });
    }

    //getProductById(id: string): IProduct | undefined {
    //return this.products.find((p) => p.id === id);
    // }

    //get total(): number {
    //return this.products.length;
    // }

    //get all(): IProduct[] {
    //return [...this.products];
    // }
}