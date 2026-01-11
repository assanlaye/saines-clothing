import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

export const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // This requires the AuthService to provide user details including role
  // For now, let's assume AuthService has a way to get the role from the token or a user profile
  // If not, we'll need to update AuthService first.

  if (authService.isAdmin()) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
