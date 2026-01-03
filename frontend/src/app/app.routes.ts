import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'suits',
    loadComponent: () => import('./features/shop/suit-list/suit-list.component').then(m => m.SuitListComponent)
  },
  {
    path: 'suits/:id',
    loadComponent: () => import('./features/shop/suit-detail/suit-detail.component').then(m => m.SuitDetailComponent)
  },
  // TODO: Add Cart and Orders routes
];
