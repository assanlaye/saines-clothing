import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';

export interface OrderItem {
  suitId: string;
  quantity: number;
  orderType: 'Purchase' | 'Rental';
  pricePerUnit: number;
  rentalDays?: number;
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

  getMyOrders(): Observable<any> {
    return this.apiService.get(`${this.endpoint}/myorders`);
  }
}
