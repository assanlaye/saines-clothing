import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent implements OnInit {
  isMenuOpen = signal(false);
  searchQuery = signal('');
  cartCount = signal(0);
  
  isAuthenticated = computed(() => this.authService.isAuthenticated());
  currentUser = signal<any>(null);

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser.set(user);
    });
  }

  toggleMenu(): void {
    this.isMenuOpen.update(val => !val);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  onSearch(): void {
    if (this.searchQuery().trim()) {
      this.router.navigate(['/products'], { 
        queryParams: { search: this.searchQuery().trim() }
      });
      this.closeMenu();
    }
  }

  logout(): void {
    this.authService.logout();
    this.closeMenu();
  }

  get userName(): string {
    const user = this.currentUser();
    if (user) {
      return `${user.firstName} ${user.lastName}`;
    }
    return '';
  }
}

