import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  async loadOrders() {
    try {
      const response = await this.orderService.getUserOrders();
      if (response.success) {
        // Flat map the items from all orders and add order metadata
        this.orders = response.orders.reverse().flatMap((order: any) =>
          order.items.map((item: any) => ({
            ...item,
            status: order.status,
            paymentMethod: order.paymentMethod,
            date: order.date
          }))
        );
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp).toDateString();
  }
}
