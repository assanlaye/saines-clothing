import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order/order.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html'
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];
  loading = true;
  error = '';

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getMyOrders().subscribe({
      next: (response) => {
        // Adapt based on backend response, assuming { success: true, count: number, data: [] }
        this.orders = response.data || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load your orders.';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
