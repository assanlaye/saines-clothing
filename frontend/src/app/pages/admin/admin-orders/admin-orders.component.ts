import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-admin-orders',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-orders.component.html',
    styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
    orders: any[] = [];

    constructor(
        private orderService: OrderService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        this.fetchOrders();
    }

    async fetchOrders() {
        try {
            const response = await this.orderService.getAllOrders();
            if (response.success) {
                this.orders = response.orders.reverse();
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            this.toastService.error('Failed to fetch orders');
        }
    }

    async updateStatus(orderId: string, event: any) {
        const status = event.target.value;
        try {
            const response = await this.orderService.updateOrderStatus(orderId, status);
            if (response.success) {
                this.toastService.success('Status updated successfully');
            } else {
                this.toastService.error(response.message);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            this.toastService.error('Failed to update status');
        }
    }
}
