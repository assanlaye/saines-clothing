import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CartService } from '../../../core/services/cart/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" routerLink="/">Saine Clothing</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" routerLink="/suits" routerLinkActive="active">Catalog</a>
            </li>
          </ul>

          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link position-relative" routerLink="/cart">
                <i class="bi bi-cart"></i> Cart
                <span class="position-absolute top-10 start-100 translate-middle badge rounded-pill bg-danger" 
                      *ngIf="cartItemCount > 0">
                  {{ cartItemCount }}
                </span>
              </a>
            </li>

            <ng-container *ngIf="authService.currentUser$ | async as user; else guestTemplate">
              <li class="nav-item dropdown">
                 <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  {{ user.name }}
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><a class="dropdown-item" routerLink="/my-orders">My Orders</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><button class="dropdown-item" (click)="logout()">Logout</button></li>
                </ul>
              </li>
            </ng-container>

            <ng-template #guestTemplate>
              <li class="nav-item">
                <a class="nav-link" routerLink="/login">Login</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/register">Register</a>
              </li>
            </ng-template>
          </ul>
        </div>
      </div>
    </nav>
  `
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
