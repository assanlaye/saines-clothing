import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { AlertService } from '../services/alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const token = this.authService.getToken();

    if (!token) {
      this.alertService.showAlert('Please login to access this page', 'warning');
      this.router.navigate(['/login']);
      return false;
    }

    // Verify token is valid by checking current user
    return this.authService.getCurrentUser().pipe(
      map(user => {
        if (user) {
          return true;
        } else {
          this.alertService.showAlert('Session expired. Please login again', 'warning');
          this.router.navigate(['/login']);
          return false;
        }
      }),
      catchError(() => {
        this.authService.logout();
        this.alertService.showAlert('Session expired. Please login again', 'warning');
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
