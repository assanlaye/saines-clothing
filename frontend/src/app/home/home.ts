import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService, Product } from '../shared/services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  featuredProducts = signal<Product[]>([]);
  latestProducts = signal<Product[]>([]);
  bestSellers = signal<Product[]>([]);
  isLoading = signal(true);

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    
    // Load featured products
    this.productService.getFeaturedProducts().subscribe({
      next: (response) => {
        if (response.success) {
          this.featuredProducts.set(response.data);
        }
      },
      error: (err) => console.error('Error loading featured products:', err)
    });

    // Load latest products
    this.productService.getLatestProducts().subscribe({
      next: (response) => {
        if (response.success) {
          this.latestProducts.set(response.data);
        }
      },
      error: (err) => console.error('Error loading latest products:', err)
    });

    // Load best sellers
    this.productService.getBestSellers().subscribe({
      next: (response) => {
        if (response.success) {
          this.bestSellers.set(response.data);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading best sellers:', err);
        this.isLoading.set(false);
      }
    });
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  getProductImage(product: Product): string {
    return product.images && product.images.length > 0 
      ? product.images[0].url 
      : '/assets/p_img1.png';
  }

  getStars(rating: number): number[] {
    const fullStars = Math.floor(rating);
    const stars = Array(fullStars).fill(1);
    return stars;
  }

  hasHalfStar(rating: number): boolean {
    return rating % 1 >= 0.5;
  }
}
