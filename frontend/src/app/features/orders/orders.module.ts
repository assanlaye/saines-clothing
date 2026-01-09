import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderHistoryComponent } from './order-history/order-history.component';

@NgModule({
  declarations: [
    CheckoutComponent,
    OrderHistoryComponent
  ],
  imports: [
    SharedModule
  ]
})
export class OrdersModule { }
