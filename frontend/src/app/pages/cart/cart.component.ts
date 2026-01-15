import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, ChevronRight, Trash2 } from 'lucide-angular';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule],
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
    cartItems: CartItem[] = [];
    subtotal = 0;
    total = 0;
    readonly DELIVERY_FEE = 10;

    readonly ChevronRight = ChevronRight;
    readonly Trash2 = Trash2;

    constructor(private cartService: CartService) { }

    ngOnInit(): void {
        this.cartService.cartItems$.subscribe(items => {
            this.cartItems = items;
            this.calculateTotals();
        });
    }

    calculateTotals() {
        this.subtotal = this.cartService.getCartTotal();
        this.total = this.subtotal > 0 ? this.subtotal + this.DELIVERY_FEE : 0;
    }

    updateQuantity(productId: string, size: string, event: any) {
        const quantity = parseInt(event.target.value) || 1;
        this.cartService.updateQuantity(productId, size, quantity);
    }

    remove(productId: string, size: string) {
        this.cartService.removeFromCart(productId, size);
    }

    getImageUrl(image: string | string[]): string {
        return Array.isArray(image) ? (image[0] || '') : (image || '');
    }
}
