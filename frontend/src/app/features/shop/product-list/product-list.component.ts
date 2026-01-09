import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductService } from '../../../core/services/product/product.service';
import { CartService } from '../../../core/services/cart/cart.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error = '';
  filterForm: FormGroup;

  // Pagination
  currentPage = 1;
  pageSize = 8;
  totalPages = 0;

  categories = ['Men', 'Women', 'Kids'];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      category: [''],
      minPrice: [''],
      maxPrice: ['']
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.setupSearchSubscription();
  }

  loadProducts(): void {
    this.loading = true;
    const params = {
      page: this.currentPage,
      limit: this.pageSize,
      ...this.filterForm.value
    };

    this.productService.getProducts(params).subscribe({
      next: (response) => {
        this.products = response.data || [];
        this.totalPages = response.pages || 1;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  setupSearchSubscription(): void {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.currentPage = 1;
        this.loadProducts();
      });
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
    }
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, product.sizes[0] || 'M', 1);
    alert(`${product.name} added to cart!`);
  }

  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }
}
