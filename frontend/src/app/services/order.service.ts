import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = `${environment.apiUrl}/order`;

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    private get headers(): HttpHeaders {
        return new HttpHeaders({
            'token': this.authService.token || ''
        });
    }

    async placeOrder(orderData: any): Promise<any> {
        return await lastValueFrom(this.http.post(`${this.apiUrl}/place`, orderData, { headers: this.headers }));
    }

    async getUserOrders(): Promise<any> {
        return await lastValueFrom(this.http.post(`${this.apiUrl}/userorders`, {}, { headers: this.headers }));
    }

    async getAllOrders(): Promise<any> {
        return await lastValueFrom(this.http.get(`${this.apiUrl}/list`, { headers: this.headers }));
    }

    async updateOrderStatus(orderId: string, status: string): Promise<any> {
        return await lastValueFrom(this.http.post(`${this.apiUrl}/status`, { orderId, status }, { headers: this.headers }));
    }
}
