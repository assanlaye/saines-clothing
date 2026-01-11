import { Routes } from '@angular/router';
import { Home } from './home/home';
import { ProductsComponent } from './pages/products/products';

export const routes: Routes = [
	{ path: '', component: Home },
	{ path: 'products', component: ProductsComponent },
	{ path: 'products/:id', loadComponent: () => import('./pages/products/product-detail/product-detail').then(m => m.ProductDetailComponent) },
	{ path: 'auth/login', loadComponent: () => import('./pages/auth/login/login').then(m => m.LoginComponent) },
	{ path: 'auth/register', loadComponent: () => import('./pages/auth/register/register').then(m => m.RegisterComponent) },
	// Future: { path: 'admin', loadComponent: () => import('./admin/admin').then(m => m.Admin) },
];
