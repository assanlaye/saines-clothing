import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/user`;
    private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
    token$ = this.tokenSubject.asObservable();
    private userSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user') || 'null'));
    user$ = this.userSubject.asObservable();

    constructor(private http: HttpClient) { }

    get token(): string | null {
        return this.tokenSubject.value;
    }

    get user(): any {
        return this.userSubject.value;
    }

    async login(credentials: any): Promise<any> {
        const response: any = await lastValueFrom(this.http.post(`${this.apiUrl}/login`, credentials));
        if (response.success && response.token) {
            this.setToken(response.token);
            this.setUser(response.user);
        }
        return response;
    }

    async register(userData: any): Promise<any> {
        const response: any = await lastValueFrom(this.http.post(`${this.apiUrl}/register`, userData));
        if (response.success && response.token) {
            this.setToken(response.token);
            this.setUser(response.user);
        }
        return response;
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.tokenSubject.next(null);
        this.userSubject.next(null);
    }

    private setToken(token: string): void {
        localStorage.setItem('token', token);
        this.tokenSubject.next(token);
    }

    private setUser(user: any): void {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
    }

    isLoggedIn(): boolean {
        return !!this.token;
    }

    isAdmin(): boolean {
        return this.user?.role === 'admin';
    }
}
