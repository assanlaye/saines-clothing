import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule, Search, User, ShoppingBag, Menu, X } from 'lucide-angular';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterModule, LucideAngularModule],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    isMenuOpen = false;
    isProfileOpen = false;
    cartCount = 0;
    isLoggedIn = false;
    isAdmin = false;

    readonly Search = Search;
    readonly User = User;
    readonly ShoppingBag = ShoppingBag;
    readonly Menu = Menu;
    readonly X = X;

    navLinks = [
        { name: 'HOME', path: '/' },
        { name: 'COLLECTION', path: '/collection' },
        { name: 'ABOUT', path: '/about' },
        { name: 'CONTACT', path: '/contact' }
    ];

    constructor(
        public router: Router,
        private cartService: CartService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.cartService.cartCount$.subscribe(count => {
            this.cartCount = count;
        });

        this.authService.token$.subscribe(token => {
            this.isLoggedIn = !!token;
        });

        this.authService.user$.subscribe(user => {
            this.isAdmin = user?.role === 'admin';
        });
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }

    isActive(path: string): boolean {
        return this.router.url === path;
    }

    logout() {
        this.authService.logout();
        this.isProfileOpen = false;
        this.router.navigate(['/login']);
    }
}
