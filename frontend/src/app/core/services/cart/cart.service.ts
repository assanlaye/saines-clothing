import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../models/product.model';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  size: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  public items$ = this.itemsSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.itemsSubject.next(JSON.parse(savedCart));
    }
  }

  private saveCart(items: CartItem[]) {
    localStorage.setItem('cart', JSON.stringify(items));
    this.itemsSubject.next(items);
  }

  getItems(): CartItem[] {
    return this.itemsSubject.value;
  }

  addToCart(product: Product, size: string, quantity: number = 1) {
    const currentItems = this.getItems();

    const existingItem = currentItems.find(item =>
      item.id === product._id &&
      item.size === size
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      this.saveCart([...currentItems]);
    } else {
      const newItem: CartItem = {
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        imageUrl: product.images[0]?.url,
        size: size
      };
      this.saveCart([...currentItems, newItem]);
    }
  }

  updateQuantity(productId: string, size: string, quantity: number) {
    const currentItems = this.getItems();
    const index = currentItems.findIndex(item => item.id === productId && item.size === size);

    if (index !== -1) {
      if (quantity <= 0) {
        this.removeFromCart(productId, size);
      } else {
        currentItems[index].quantity = quantity;
        this.saveCart([...currentItems]);
      }
    }
  }

  removeFromCart(productId: string, size: string) {
    let currentItems = this.getItems();
    currentItems = currentItems.filter(item => !(item.id === productId && item.size === size));
    this.saveCart(currentItems);
  }

  clearCart() {
    this.saveCart([]);
  }

  getTotalPrice(): number {
    return this.getItems().reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getItemCount(): number {
    return this.getItems().reduce((count, item) => count + item.quantity, 0);
  }
}
