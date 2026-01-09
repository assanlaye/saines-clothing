import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../../core/services/cart/cart.service';

@Component({
  selector: 'app-cart-view',
  templateUrl: './cart-view.component.html'
})
export class CartViewComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice = 0;

  constructor(public cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.items$.subscribe(items => {
      this.cartItems = items;
      this.totalPrice = this.cartService.getTotalPrice();
    });
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.id, item.size);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}
