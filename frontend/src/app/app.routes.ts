import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CollectionComponent } from './pages/collection/collection.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { PlaceOrderComponent } from './pages/place-order/place-order.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { AdminLayoutComponent } from './pages/admin/admin-layout/admin-layout.component';
import { AdminProductsComponent } from './pages/admin/admin-products/admin-products.component';
import { AdminAddProductComponent } from './pages/admin/admin-add-product/admin-add-product.component';
import { AdminOrdersComponent } from './pages/admin/admin-orders/admin-orders.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'collection', component: CollectionComponent },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'product/:id', component: ProductDetailComponent },
    { path: 'cart', component: CartComponent },
    { path: 'place-order', component: PlaceOrderComponent, canActivate: [authGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'orders', component: OrdersComponent, canActivate: [authGuard] },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [adminGuard],
        children: [
            { path: 'products', component: AdminProductsComponent },
            { path: 'add-product', component: AdminAddProductComponent },
            { path: 'orders', component: AdminOrdersComponent },
            { path: '', redirectTo: 'products', pathMatch: 'full' }
        ]
    }
];
