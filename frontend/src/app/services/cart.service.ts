import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

export interface CartItem extends Product {
    quantity: number;
    size: string;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartItems: CartItem[] = JSON.parse(localStorage.getItem('cartItems') || '[]');
    private cartCountSubject = new BehaviorSubject<number>(this.calculateCount());
    private cartTotalSubject = new BehaviorSubject<number>(this.calculateTotal());
    private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.cartItems);

    cartCount$ = this.cartCountSubject.asObservable();
    cartTotal$ = this.cartTotalSubject.asObservable();
    cartItems$ = this.cartItemsSubject.asObservable();

    constructor() { }

    addToCart(product: Product, size: string) {
        const existingItem = this.cartItems.find(item => item._id === product._id && item.size === size);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cartItems.push({ ...product, size, quantity: 1 });
        }
        this.updateCart();
    }

    removeFromCart(productId: string, size: string) {
        this.cartItems = this.cartItems.filter(item => !(item._id === productId && item.size === size));
        this.updateCart();
    }

    updateQuantity(productId: string, size: string, quantity: number) {
        const item = this.cartItems.find(item => item._id === productId && item.size === size);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeFromCart(productId, size);
            } else {
                this.updateCart();
            }
        }
    }

    getCartItems() {
        return this.cartItems;
    }

    getCartCount() {
        return this.calculateCount();
    }

    getCartTotal() {
        return this.calculateTotal();
    }

    clearCart() {
        this.cartItems = [];
        this.updateCart();
    }

    private updateCart() {
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
        this.cartCountSubject.next(this.calculateCount());
        this.cartTotalSubject.next(this.calculateTotal());
        this.cartItemsSubject.next([...this.cartItems]);
    }

    private calculateCount() {
        return this.cartItems.reduce((acc, item) => acc + item.quantity, 0);
    }

    private calculateTotal() {
        return this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }
}
