import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product/product.service';
import { CartService } from '../../core/services/cart/cart.service';
import { AlertService } from '../../core/services/alert/alert.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Hero Section -->
      <section class="text-center py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg mb-12">
        <h1 class="text-4xl md:text-6xl font-bold mb-4">Welcome to Saine Clothing</h1>
        <p class="text-xl md:text-2xl mb-8">Discover the latest fashion trends and express your unique style</p>
        <a routerLink="/products" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Shop Now
        </a>
      </section>

      <!-- Featured Products -->
      <section class="mb-12">
        <h2 class="text-3xl font-bold text-center mb-8">Featured Products</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" *ngIf="featuredProducts.length > 0; else loading">
          <div *ngFor="let product of featuredProducts" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img [src]="product.images[0]?.url || '/assets/no-image.jpg'" [alt]="product.name"
                 class="w-full h-64 object-cover">
            <div class="p-4">
              <h3 class="font-semibold text-lg mb-2">{{ product.name }}</h3>
              <p class="text-gray-600 text-sm mb-2">{{ product.description | slice:0:100 }}...</p>
              <div class="flex items-center justify-between">
                <span class="text-xl font-bold text-blue-600">${{ product.price }}</span>
                <button (click)="addToCart(product)"
                        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
        <ng-template #loading>
          <div class="text-center py-12">
            <p class="text-gray-500">Loading featured products...</p>
          </div>
        </ng-template>
      </section>

      <!-- Categories -->
      <section class="mb-12">
        <h2 class="text-3xl font-bold text-center mb-8">Shop by Category</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div *ngFor="let category of categories"
               class="bg-gray-100 p-6 rounded-lg text-center hover:bg-gray-200 transition-colors cursor-pointer"
               [routerLink]="['/products']" [queryParams]="{ category: category }">
            <h3 class="font-semibold text-lg">{{ category }}</h3>
          </div>
        </div>
      </section>

      <!-- About Section -->
      <section class="bg-gray-50 p-8 rounded-lg">
        <div class="text-center">
          <h2 class="text-3xl font-bold mb-4">Why Choose Saine Clothing?</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div class="text-center">
              <div class="text-4xl mb-4">👕</div>
              <h3 class="font-semibold mb-2">Quality Materials</h3>
              <p class="text-gray-600">Premium fabrics and attention to detail in every piece</p>
            </div>
            <div class="text-center">
              <div class="text-4xl mb-4">🚚</div>
              <h3 class="font-semibold mb-2">Fast Delivery</h3>
              <p class="text-gray-600">Quick and reliable shipping to get your orders fast</p>
            </div>
            <div class="text-center">
              <div class="text-4xl mb-4">💯</div>
              <h3 class="font-semibold mb-2">Satisfaction Guarantee</h3>
              <p class="text-gray-600">Love it or return it - your satisfaction is our priority</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class HomeComponent implements OnInit {
  featuredProducts: any[] = [];
  categories = ['Men', 'Women', 'Kids', 'Accessories'];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts() {
    this.productService.getProducts({ featured: 'true', limit: '8' }).subscribe({
      next: (response) => {
        this.featuredProducts = response.data;
      },
      error: (error) => {
        console.error('Error loading featured products:', error);
      }
    });
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
    this.alertService.showAlert('Product added to cart!', 'success');
  }
}