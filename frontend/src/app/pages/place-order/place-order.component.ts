import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule, ChevronRight } from 'lucide-angular';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-place-order',
    standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule, LucideAngularModule],
    templateUrl: './place-order.component.html',
    styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent implements OnInit {
    orderForm: FormGroup;
    paymentMethod = 'wave';
    subtotal = 0;
    total = 0;
    readonly SHIPPING_FEE = 10;
    readonly ChevronRight = ChevronRight;
    
    regions = [
        'Banjul',
        'Kanifing Municipality (KMC)',
        'West Coast Region',
        'Lower River Region',
        'North Bank Region',
        'Central River Region',
        'Upper River Region'
    ];

    constructor(
        private fb: FormBuilder,
        private cartService: CartService,
        private orderService: OrderService,
        private authService: AuthService,
        private toastService: ToastService,
        private router: Router
    ) {
        this.orderForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            lastName: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            region: ['', [Validators.required]],
            townArea: ['', [Validators.required]],
            phone: ['', [Validators.required, Validators.pattern('^\\+220\\s?[0-9]{7}$')]]
        });
    }

    ngOnInit(): void {
        this.cartService.cartItems$.subscribe(() => {
            this.calculateTotals();
        });
    }

    calculateTotals() {
        this.subtotal = this.cartService.getCartTotal();
        this.total = this.subtotal > 0 ? this.subtotal + this.SHIPPING_FEE : 0;
    }

    async handleSubmit() {
        if (this.orderForm.invalid) {
            this.orderForm.markAllAsTouched();
            this.toastService.error('Please fill in all required fields correctly.');
            return;
        }

        if (this.cartService.getCartCount() === 0) {
            this.toastService.error('Your cart is empty');
            return;
        }

        if (!this.authService.isLoggedIn()) {
            this.toastService.info('Please login to place an order');
            this.router.navigate(['/login']);
            return;
        }

        const orderData = {
            items: this.cartService.getCartItems(),
            amount: this.total,
            address: this.orderForm.value,
            paymentMethod: this.paymentMethod
        };

        try {
            const response = await this.orderService.placeOrder(orderData);
            if (response.success) {
                this.toastService.success('Order placed successfully!');
                this.cartService.clearCart();
                this.router.navigate(['/orders']);
            } else {
                this.toastService.error(response.message);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            this.toastService.error('Failed to place order. Please try again.');
        }
    }

    isFieldInvalid(field: string): boolean {
        const control = this.orderForm.get(field);
        return !!(control && control.invalid && (control.dirty || control.touched));
    }
}
