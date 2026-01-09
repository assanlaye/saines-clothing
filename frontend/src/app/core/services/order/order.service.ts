import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';

export interface OrderItem {
  productId: string;
  quantity: number;
  size: string;
  price: number;
}

export interface DeliveryAddress {
  city: string;
  homeAddress: string;
  phoneNumber: string;
}

export interface OrderRequest {
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: DeliveryAddress;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private endpoint = 'orders';

  constructor(private apiService: ApiService) { }

  createOrder(orderData: OrderRequest): Observable<any> {
    return this.apiService.post(this.endpoint, orderData);
  }

  getMyOrders(): Observable<{ success: boolean, count: number, data: any[] }> {
    return this.apiService.get(this.endpoint);
  }

  updateOrderStatus(id: string, status: string): Observable<any> {
    return this.apiService.put(`${this.endpoint}/${id}`, { status });
  }
}
