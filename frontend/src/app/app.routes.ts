import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
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
    loadComponent: () => import('./features/orders/checkout/checkout.component').then(m => m.CheckoutComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'my-orders',
    loadComponent: () => import('./features/orders/order-history/order-history.component').then(m => m.OrderHistoryComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/products',
    loadComponent: () => import('./features/admin/product-management/product-management.component').then(m => m.ProductManagementComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/orders',
    loadComponent: () => import('./features/admin/order-management/order-management.component').then(m => m.OrderManagementComponent),
    canActivate: [AdminGuard]
  },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
];
