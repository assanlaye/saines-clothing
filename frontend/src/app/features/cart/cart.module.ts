import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CartViewComponent } from './cart-view/cart-view.component';

@NgModule({
  declarations: [
    CartViewComponent
  ],
  imports: [
    SharedModule
  ]
})
export class CartModule { }
