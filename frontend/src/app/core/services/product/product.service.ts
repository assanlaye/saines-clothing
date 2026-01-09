import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private endpoint = 'products';

  constructor(private apiService: ApiService) { }

  getProducts(params?: any): Observable<{ count: number, pagination: any, data: Product[], pages: number }> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.apiService.get(this.endpoint, httpParams);
  }

  getProductById(id: string): Observable<{ success: boolean, data: Product }> {
    return this.apiService.get(`${this.endpoint}/${id}`);
  }
}
