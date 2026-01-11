import { Routes } from '@angular/router';
import { Home } from './home/home';

export const routes: Routes = [
	{ path: '', component: Home },
	// Future: { path: 'auth', loadComponent: () => import('./auth/auth').then(m => m.Auth) },
	// Future: { path: 'products', loadComponent: () => import('./products/products').then(m => m.Products) },
	// Future: { path: 'admin', loadComponent: () => import('./admin/admin').then(m => m.Admin) },
];
