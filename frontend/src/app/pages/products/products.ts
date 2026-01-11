import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../shared/services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class ProductsComponent implements OnInit {
  products = signal<Product[]>([]);
  isLoading = signal(true);
  currentPage = signal(1);
  totalPages = signal(1);
  totalProducts = signal(0);
  
  // Filters
  searchQuery = signal('');
  selectedCategory = signal<string>('');
  selectedType = signal<string>('');
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  sortBy = signal<string>('-createdAt');

  categories = ['Men', 'Women', 'Kids'];
  types = ['Topwear', 'Bottomwear', 'Winterwear', 'Basics'];
  sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: '-averageRating', label: 'Highest Rated' }
  ];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  get pageNumbers(): number[] {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['search']) this.searchQuery.set(params['search']);
      if (params['category']) this.selectedCategory.set(params['category']);
      if (params['type']) this.selectedType.set(params['type']);
      if (params['minPrice']) this.minPrice.set(Number(params['minPrice']));
      if (params['maxPrice']) this.maxPrice.set(Number(params['maxPrice']));
      if (params['page']) this.currentPage.set(Number(params['page']));
      if (params['sort']) this.sortBy.set(params['sort']);
      
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.isLoading.set(true);
    
    const params: any = {
      page: this.currentPage(),
      limit: 12,
      sort: this.sortBy()
    };

    if (this.searchQuery()) params.search = this.searchQuery();
    if (this.selectedCategory()) params.category = this.selectedCategory();
    if (this.selectedType()) params.type = this.selectedType();
    if (this.minPrice()) params.minPrice = this.minPrice();
    if (this.maxPrice()) params.maxPrice = this.maxPrice();

    this.productService.getAllProducts(params).subscribe({
      next: (response) => {
        if (response.success) {
          this.products.set(response.data);
          this.totalPages.set(response.pages);
          this.totalProducts.set(response.total);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.isLoading.set(false);
      }
    });
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.updateQueryParams();
  }

  onFilterChange(): void {
    this.currentPage.set(1);
    this.updateQueryParams();
  }

  updateQueryParams(): void {
    const queryParams: any = {};
    
    if (this.searchQuery()) queryParams.search = this.searchQuery();
    if (this.selectedCategory()) queryParams.category = this.selectedCategory();
    if (this.selectedType()) queryParams.type = this.selectedType();
    if (this.minPrice()) queryParams.minPrice = this.minPrice();
    if (this.maxPrice()) queryParams.maxPrice = this.maxPrice();
    if (this.currentPage() > 1) queryParams.page = this.currentPage();
    if (this.sortBy() !== '-createdAt') queryParams.sort = this.sortBy();

    this.router.navigate(['/products'], { queryParams });
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('');
    this.selectedType.set('');
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.sortBy.set('-createdAt');
    this.currentPage.set(1);
    this.router.navigate(['/products']);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.updateQueryParams();
    }
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
    return Array(Math.floor(rating)).fill(1);
  }

  hasHalfStar(rating: number): boolean {
    return rating % 1 >= 0.5;
  }

  getPageNumbers(): number[] {
    return Array.from({length: this.totalPages()}, (_, i) => i + 1);
  }

  onMinPriceChange(value: string): void {
    this.minPrice.set(value ? Number(value) : null);
    this.onFilterChange();
  }

  onMaxPriceChange(value: string): void {
    this.maxPrice.set(value ? Number(value) : null);
    this.onFilterChange();
  }
}

