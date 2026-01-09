import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { ProductService } from '../../../core/services/product/product.service';
import { CartService } from '../../../core/services/cart/cart.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  error = '';
  selectedSize: string = '';
  activeImage: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private location: Location
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
    } else {
      this.error = 'Invalid product ID';
      this.loading = false;
    }
  }

  loadProduct(id: string): void {
    this.productService.getProductById(id).subscribe({
      next: (response) => {
        this.product = response.data;
        if (this.product) {
          this.activeImage = this.product.images[0]?.url;
          if (this.product.sizes.length > 0) {
            this.selectedSize = this.product.sizes[0];
          }
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load product details.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  addToCart(): void {
    if (this.product) {
      // Adapter for legacy cart service
      const cartProduct = {
        _id: this.product._id,
        name: this.product.name,
        purchasePrice: this.product.price,
        imageUrl: this.product.images[0]?.url
      };
      this.cartService.addToCart(cartProduct, this.selectedSize, 'Purchase');
      alert('Added to cart!');
    }
  }

  goBack(): void {
    this.location.back();
  }
}
