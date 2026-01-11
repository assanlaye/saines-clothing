import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = `${environment.apiUrl}/product`;

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    private get headers(): HttpHeaders {
        return new HttpHeaders({
            'token': this.authService.token || ''
        });
    }

    getProducts(filters: any = {}): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/list`, { params: filters });
    }

    async getProductById(id: string): Promise<Product | undefined> {
        const response: any = await lastValueFrom(this.http.get(`${this.apiUrl}/single/${id}`));
        return response.success ? response.product : undefined;
    }

    async addProduct(productData: any): Promise<any> {
        // When sending FormData, don't set 'Content-Type' header manually. 
        // Angular HttpClient will set it automatically with the correct boundary.
        const headers = new HttpHeaders({
            'token': this.authService.token || ''
        });
        return await lastValueFrom(this.http.post(`${this.apiUrl}/add`, productData, { headers }));
    }

    async removeProduct(id: string): Promise<any> {
        return await lastValueFrom(this.http.post(`${this.apiUrl}/remove`, { id }, { headers: this.headers }));
    }

    async updateProduct(productData: any): Promise<any> {
        const headers = new HttpHeaders({
            'token': this.authService.token || ''
        });
        return await lastValueFrom(this.http.post(`${this.apiUrl}/update`, productData, { headers }));
    }
}
