import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'suits',
    loadComponent: () => import('./features/shop/suit-list/suit-list.component').then(m => m.SuitListComponent)
  },
  {
    path: 'suits/:id',
    loadComponent: () => import('./features/shop/suit-detail/suit-detail.component').then(m => m.SuitDetailComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./features/shop/product-list/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./features/shop/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart-view/cart-view.component').then(m => m.CartViewComponent)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/orders/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  {
    path: 'my-orders',
    loadComponent: () => import('./features/orders/order-history/order-history.component').then(m => m.OrderHistoryComponent)
  },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
];
