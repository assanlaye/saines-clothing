import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { OrderManagementComponent } from './order-management/order-management.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    ProductManagementComponent,
    OrderManagementComponent
  ],
  imports: [
    SharedModule
  ]
})
export class AdminModule { }
