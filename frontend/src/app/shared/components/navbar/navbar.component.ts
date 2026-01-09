import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CartService } from '../../../core/services/cart/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html'
})
export class NavbarComponent {
  cartItemCount = 0;

  constructor(public authService: AuthService, private cartService: CartService) {
    this.cartService.items$.subscribe(items => {
      this.cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    });
  }

  logout() {
    this.authService.logout();
  }
}
