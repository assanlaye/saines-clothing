import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export const API_URL = 'http://localhost:5000/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (token) {
      return this.headers.set('Authorization', `Bearer ${token}`);
    }
    return this.headers;
  }

  get<T>(endpoint: string, requireAuth: boolean = false): Observable<T> {
    const headers = requireAuth ? this.getAuthHeaders() : this.headers;
    return this.http.get<T>(`${API_URL}${endpoint}`, { headers });
  }

  post<T>(endpoint: string, data: any, requireAuth: boolean = false): Observable<T> {
    const headers = requireAuth ? this.getAuthHeaders() : this.headers;
    return this.http.post<T>(`${API_URL}${endpoint}`, data, { headers });
  }

  put<T>(endpoint: string, data: any, requireAuth: boolean = true): Observable<T> {
    const headers = requireAuth ? this.getAuthHeaders() : this.headers;
    return this.http.put<T>(`${API_URL}${endpoint}`, data, { headers });
  }

  delete<T>(endpoint: string, requireAuth: boolean = true): Observable<T> {
    const headers = requireAuth ? this.getAuthHeaders() : this.headers;
    return this.http.delete<T>(`${API_URL}${endpoint}`, { headers });
  }
}

