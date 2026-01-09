import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SuitService, Suit } from '../../../core/services/suit/suit.service';
import { CartService } from '../../../core/services/cart/cart.service';
import { AlertService } from '../../../core/services/alert/alert.service';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-suit-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './suit-list.component.html',
  styles: [`
    .card-img-top { height: 300px; object-fit: cover; }
    .card { transition: transform 0.2s; }
    .card:hover { transform: translateY(-5px); }
  `]
})
export class SuitListComponent implements OnInit {
  suits: Suit[] = [];
  loading = true;
  error = '';
  filterForm: FormGroup;

  // Pagination
  currentPage = 1;
  pageSize = 9;
  totalItems = 0;
  totalPages = 0;

  constructor(
    private suitService: SuitService,
    private cartService: CartService,
    private alertService: AlertService,
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
    this.loadSuits();
    this.setupSearchSubscription();
  }

  loadSuits(): void {
    this.loading = true;
    const params = {
      page: this.currentPage,
      limit: this.pageSize,
      ...this.filterForm.value
    };

    this.suitService.getSuits(params).subscribe({
      next: (response) => {
        // Adapt based on actual backend response structure
        // Assuming { count: number, pagination: object, data: Suit[] }
        this.suits = response.data || [];
        this.totalItems = response.count || 0;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load suits.';
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
        this.currentPage = 1; // Reset to page 1 on filter change
        this.loadSuits();
      });
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadSuits();
    }
  }

  addToCart(suit: Suit): void {
    this.cartService.addToCart(suit);
    this.alertService.success('Added to cart!');
  }

  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }
}
