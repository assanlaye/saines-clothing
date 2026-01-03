import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  size?: string;
  orderType: 'Purchase' | 'Rental';
  rentalDays?: number;
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

  addToCart(product: any, size: string = 'M', orderType: 'Purchase' | 'Rental' = 'Purchase', rentalDays: number = 0) {
    const currentItems = this.getItems();
    const price = orderType === 'Purchase' ? product.purchasePrice : product.rentalPricePerDay;

    const existingItem = currentItems.find(item =>
      item.id === product._id &&
      item.size === size &&
      item.orderType === orderType
    );

    if (existingItem) {
      existingItem.quantity += 1;
      this.saveCart([...currentItems]);
    } else {
      const newItem: CartItem = {
        id: product._id,
        name: product.name,
        price: price,
        quantity: 1,
        imageUrl: product.imageUrl,
        size: size,
        orderType: orderType,
        rentalDays: rentalDays
      };
      this.saveCart([...currentItems, newItem]);
    }
  }

  removeFromCart(itemId: string, size?: string) {
    let currentItems = this.getItems();
    currentItems = currentItems.filter(item => !(item.id === itemId && (size ? item.size === size : true)));
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
