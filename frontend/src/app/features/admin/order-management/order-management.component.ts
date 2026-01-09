import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../core/services/order/order.service';
import { AlertService } from '../../../core/services/alert/alert.service';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html'
})
export class OrderManagementComponent implements OnInit {
  orders: any[] = [];
  loading = false;

  constructor(
    private orderService: OrderService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.loadAllOrders();
  }

  loadAllOrders(): void {
    this.loading = true;
    this.orderService.getMyOrders().subscribe({ // Note: getMyOrders also works for admins to get all since backend handles it
      next: (res) => {
        this.orders = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.alertService.error('Failed to load orders');
        this.loading = false;
      }
    });
  }

  updateStatus(id: string, status: string): void {
    this.orderService.updateOrderStatus(id, status).subscribe({
      next: () => {
        this.alertService.success(`Order marked as ${status}`);
        this.loadAllOrders();
      },
      error: (err) => this.alertService.error('Failed to update status')
    });
  }
}
