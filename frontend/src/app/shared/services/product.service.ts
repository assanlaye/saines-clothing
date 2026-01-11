import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  type: string;
  sizes: string[];
  colors: string[];
  images: { url: string; publicId?: string }[];
  stockQuantity: number;
  featured: boolean;
  onSale: boolean;
  averageRating: number;
  numReviews: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  pagination: any;
  data: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private apiService: ApiService) {}

  getAllProducts(params?: any): Observable<ProductsResponse> {
    let query = '';
    if (params) {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      query = '?' + queryParams.toString();
    }
    return this.apiService.get<ProductsResponse>(`/products${query}`);
  }

  getProductById(id: string): Observable<{ success: boolean; data: Product }> {
    return this.apiService.get<{ success: boolean; data: Product }>(`/products/${id}`);
  }

  getFeaturedProducts(): Observable<{ success: boolean; count: number; data: Product[] }> {
    return this.apiService.get<{ success: boolean; count: number; data: Product[] }>('/products/featured');
  }

  getLatestProducts(): Observable<{ success: boolean; count: number; data: Product[] }> {
    return this.apiService.get<{ success: boolean; count: number; data: Product[] }>('/products/latest');
  }

  getBestSellers(): Observable<{ success: boolean; count: number; data: Product[] }> {
    return this.apiService.get<{ success: boolean; count: number; data: Product[] }>('/products/bestsellers');
  }

  createProduct(product: Partial<Product>): Observable<{ success: boolean; data: Product }> {
    return this.apiService.post<{ success: boolean; data: Product }>('/products', product, true);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<{ success: boolean; data: Product }> {
    return this.apiService.put<{ success: boolean; data: Product }>(`/products/${id}`, product, true);
  }

  deleteProduct(id: string): Observable<{ success: boolean; data: any }> {
    return this.apiService.delete<{ success: boolean; data: any }>(`/products/${id}`, true);
  }
}

