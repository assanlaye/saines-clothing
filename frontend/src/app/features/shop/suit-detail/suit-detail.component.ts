import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { SuitService, Suit } from '../../../core/services/suit/suit.service';
import { CartService } from '../../../core/services/cart/cart.service';

@Component({
  selector: 'app-suit-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './suit-detail.component.html'
})
export class SuitDetailComponent implements OnInit {
  suit: Suit | null = null;
  loading = true;
  error = '';
  selectedSize: string = '';
  rentalDays: number = 3; // Default rental period

  constructor(
    private route: ActivatedRoute,
    private suitService: SuitService,
    private cartService: CartService,
    private location: Location
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSuit(id);
    } else {
      this.error = 'Invalid suit ID';
      this.loading = false;
    }
  }

  loadSuit(id: string): void {
    this.suitService.getSuitById(id).subscribe({
      next: (response) => {
        // Assuming response structure { success: boolean, data: Suit }
        this.suit = response.data;
        if (this.suit && this.suit.sizes.length > 0) {
          this.selectedSize = this.suit.sizes[0];
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load suit details.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  addToCart(type: 'Purchase' | 'Rental'): void {
    if (this.suit) {
      this.cartService.addToCart(this.suit, this.selectedSize, type, type === 'Rental' ? this.rentalDays : 0);
      alert(`Added to cart as ${type}!`);
    }
  }

  goBack(): void {
    this.location.back();
  }
}
