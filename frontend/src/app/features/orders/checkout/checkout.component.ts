import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart/cart.service';
import { OrderService, OrderRequest, OrderItem } from '../../../core/services/order/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  loading = false;
  error = '';
  totalPrice = 0;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      city: ['', Validators.required],
      homeAddress: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }

  ngOnInit(): void {
    const items = this.cartService.getItems();
    if (items.length === 0) {
      this.router.navigate(['/cart']);
      return;
    }
    this.totalPrice = this.cartService.getTotalPrice();
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const cartItems = this.cartService.getItems();
    const orderItems: OrderItem[] = cartItems.map(item => ({
      suitId: item.id,
      quantity: item.quantity,
      orderType: item.orderType,
      pricePerUnit: item.price,
      rentalDays: item.rentalDays // Optional, depends on backend logic handling
    }));

    const orderPayload: OrderRequest = {
      items: orderItems,
      totalAmount: this.totalPrice,
      deliveryAddress: this.checkoutForm.value
    };

    this.orderService.createOrder(orderPayload).subscribe({
      next: (res) => {
        this.loading = false;
        this.cartService.clearCart();
        alert('Order placed successfully!');
        this.router.navigate(['/suits']); // Ideally navigate to an Order Success or History page
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to place order. Please try again.';
        console.error(err);
      }
    });
  }
}
