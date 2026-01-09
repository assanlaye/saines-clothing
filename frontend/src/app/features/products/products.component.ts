import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductService, Product, ProductFilters } from '../../core/services/product/product.service';
import { CartService } from '../../core/services/cart/cart.service';
import { AlertService } from '../../core/services/alert/alert.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-4">Our Products</h1>

        <!-- Search and Filters -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Search -->
            <div class="md:col-span-2">
              <input
                type="text"
                [(ngModel)]="searchQuery"
                placeholder="Search products..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                (input)="onSearchChange($event)">
            </div>

            <!-- Category Filter -->
            <div>
              <select
                [(ngModel)]="selectedCategory"
                (change)="onFiltersChange()"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All Categories</option>
                <option *ngFor="let category of categories" [value]="category">{{ category }}</option>
              </select>
            </div>

            <!-- Sort -->
            <div>
              <select
                [(ngModel)]="sortBy"
                (change)="onFiltersChange()"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="-createdAt">Newest First</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-averageRating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading products...</p>
      </div>

      <!-- Products Grid -->
      <div *ngIf="!loading && products.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div *ngFor="let product of products" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <!-- Product Image -->
          <div class="relative">
            <img [src]="product.images[0]?.url || '/assets/no-image.jpg'"
                 [alt]="product.name"
                 class="w-full h-64 object-cover cursor-pointer"
                 [routerLink]="['/product', product._id]">
            <!-- Badges -->
            <div class="absolute top-2 left-2 flex flex-col gap-1">
              <span *ngIf="product.featured" class="bg-blue-600 text-white text-xs px-2 py-1 rounded">Featured</span>
              <span *ngIf="product.onSale" class="bg-red-600 text-white text-xs px-2 py-1 rounded">On Sale</span>
            </div>
          </div>

          <!-- Product Info -->
          <div class="p-4">
            <h3 class="font-semibold text-lg mb-2 cursor-pointer hover:text-blue-600"
                [routerLink]="['/product', product._id]">{{ product.name }}</h3>
            <p class="text-gray-600 text-sm mb-2">{{ product.description | slice:0:80 }}...</p>

            <!-- Rating -->
            <div class="flex items-center mb-2">
              <div class="flex text-yellow-400">
                <span *ngFor="let star of [1,2,3,4,5]" class="text-lg">
                  {{ star <= product.averageRating ? '★' : '☆' }}
                </span>
              </div>
              <span class="text-sm text-gray-600 ml-2">({{ product.numReviews }})</span>
            </div>

            <!-- Price -->
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <span class="text-xl font-bold text-blue-600">${{ product.price }}</span>
                <span *ngIf="product.originalPrice" class="text-sm text-gray-500 line-through">
                  ${{ product.originalPrice }}
                </span>
              </div>
            </div>

            <!-- Add to Cart Button -->
            <button
              (click)="addToCart(product)"
              [disabled]="product.stockQuantity === 0"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
              {{ product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && products.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">🛍️</div>
        <h3 class="text-xl font-semibold mb-2">No products found</h3>
        <p class="text-gray-600 mb-4">Try adjusting your search or filters</p>
        <button (click)="clearFilters()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Clear Filters
        </button>
      </div>

      <!-- Pagination -->
      <div *ngIf="!loading && pagination.total > pagination.limit" class="flex justify-center mt-8">
        <div class="flex gap-2">
          <button
            [disabled]="pagination.page <= 1"
            (click)="changePage(pagination.page - 1)"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>

          <span class="px-4 py-2 border border-gray-300 rounded-lg bg-blue-600 text-white">
            {{ pagination.page }} of {{ pagination.pages }}
          </span>

          <button
            [disabled]="pagination.page >= pagination.pages"
            (click)="changePage(pagination.page + 1)"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: string[] = [];
  loading = true;

  // Filters
  searchQuery = '';
  selectedCategory = '';
  sortBy = '-createdAt';
  currentPage = 1;

  // Pagination
  pagination = {
    page: 1,
    pages: 1,
    total: 0,
    limit: 12
  };

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Load categories
    this.loadCategories();

    // Handle query parameters
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.searchQuery = params['search'] || '';
      this.selectedCategory = params['category'] || '';
      this.currentPage = +params['page'] || 1;
      this.loadProducts();
    });

    // Debounce search input
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.currentPage = 1;
      this.updateQueryParams();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data.categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadProducts() {
    this.loading = true;

    const filters: ProductFilters = {
      search: this.searchQuery || undefined,
      category: this.selectedCategory || undefined,
      page: this.currentPage,
      limit: this.pagination.limit,
      sort: this.sortBy
    };

    this.productService.getProducts(filters).subscribe({
      next: (response) => {
        this.products = response.data;
        this.pagination = response.pagination;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.alertService.showAlert('Failed to load products', 'error');
        this.loading = false;
      }
    });
  }

  onSearchChange(event: any) {
    this.searchQuery = event.target.value;
    this.searchSubject.next(this.searchQuery);
  }

  onFiltersChange() {
    this.currentPage = 1;
    this.updateQueryParams();
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.pagination.pages) {
      this.currentPage = page;
      this.updateQueryParams();
    }
  }

  updateQueryParams() {
    const queryParams: any = {};

    if (this.searchQuery) queryParams.search = this.searchQuery;
    if (this.selectedCategory) queryParams.category = this.selectedCategory;
    if (this.currentPage > 1) queryParams.page = this.currentPage;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.sortBy = '-createdAt';
    this.currentPage = 1;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}
    });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    this.alertService.showAlert('Product added to cart!', 'success');
  }
}