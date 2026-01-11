import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone?: string;
  address?: any;
}

export interface LoginResponse {
  success: boolean;
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated = signal<boolean>(false);

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    this.checkAuth();
  }

  private checkAuth(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.getProfile().subscribe({
        next: (response) => {
          this.currentUserSubject.next(response.user);
          this.isAuthenticated.set(true);
        },
        error: () => {
          this.logout();
        }
      });
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>('/auth/login', { email, password })
      .pipe(
        tap(response => {
          if (response.success && response.token) {
            localStorage.setItem('token', response.token);
            this.currentUserSubject.next({
              _id: response._id,
              firstName: response.firstName,
              lastName: response.lastName,
              email: response.email,
              role: response.role
            });
            this.isAuthenticated.set(true);
          }
        })
      );
  }

  register(userData: any): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>('/auth/register', userData)
      .pipe(
        tap(response => {
          if (response.success && response.token) {
            localStorage.setItem('token', response.token);
            this.currentUserSubject.next({
              _id: response._id,
              firstName: response.firstName,
              lastName: response.lastName,
              email: response.email,
              role: response.role
            });
            this.isAuthenticated.set(true);
          }
        })
      );
  }

  getProfile(): Observable<{ success: boolean; user: User }> {
    return this.apiService.get<{ success: boolean; user: User }>('/auth/profile', true);
  }

  updateProfile(userData: any): Observable<any> {
    return this.apiService.put('/auth/profile', userData, true);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'admin';
  }
}

