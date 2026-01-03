import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';

export interface Suit {
  _id: string;
  name: string;
  description: string;
  category: 'Male' | 'Female' | 'Unisex';
  ageRange: 'Kids' | 'Teens' | 'Adults';
  sizes: string[];
  color: string;
  purchasePrice: number;
  rentalPricePerDay: number;
  imageUrl: string;
  availableQuantity: number;
  condition: 'New' | 'Good' | 'Fair';
}

@Injectable({
  providedIn: 'root'
})
export class SuitService {
  private endpoint = 'suits';

  constructor(private apiService: ApiService) { }

  getSuits(params?: any): Observable<{ count: number, pagination: any, data: Suit[] }> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.apiService.get(this.endpoint, httpParams);
  }

  getSuitById(id: string): Observable<{ success: boolean, data: Suit }> {
    return this.apiService.get(`${this.endpoint}/${id}`);
  }

  getFeaturedSuits(): Observable<{ success: boolean, data: Suit[] }> {
    // Assuming backend support or filtering client side. 
    // For now, let's fetch all and filter or add specific endpoint if it exists
    return this.apiService.get(this.endpoint);
  }
}
