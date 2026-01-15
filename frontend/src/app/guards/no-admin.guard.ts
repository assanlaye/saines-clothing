import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const noAdminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If user is admin, prevent access to non-admin pages
  if (authService.isAdmin()) {
    // Redirect admins to the admin panel
    router.navigate(['/admin']);
    return false;
  }

  return true;
};
