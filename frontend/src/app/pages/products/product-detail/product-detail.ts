import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../../shared/services/product.service';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss'
})
export class ProductDetailComponent implements OnInit {
  product = signal<Product | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);
  
  selectedImage = signal<string>('');
  selectedSize = signal<string>('');
  selectedColor = signal<string>('');
  quantity = signal(1);
  
  relatedProducts = signal<Product[]>([]);
  
  isAuthenticated = computed(() => this.authService.isAuthenticated());

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      if (productId) {
        this.loadProduct(productId);
      }
    });
  }

  loadProduct(id: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.productService.getProductById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const product = response.data;
          this.product.set(product);
          
          // Set default selected image
          if (product.images && product.images.length > 0) {
            this.selectedImage.set(product.images[0].url);
          }
          
          // Set default size and color if available
          if (product.sizes && product.sizes.length > 0) {
            this.selectedSize.set(product.sizes[0]);
          }
          if (product.colors && product.colors.length > 0) {
            this.selectedColor.set(product.colors[0]);
          }
          
          // Load related products
          this.loadRelatedProducts(product.category, product.type, id);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Product not found');
        this.isLoading.set(false);
        console.error('Error loading product:', err);
      }
    });
  }

  loadRelatedProducts(category: string, type: string, excludeId: string): void {
    this.productService.getAllProducts({
      category,
      type,
      limit: 4
    }).subscribe({
      next: (response) => {
        if (response.success) {
          const related = response.data.filter(p => p._id !== excludeId).slice(0, 4);
          this.relatedProducts.set(related);
        }
      },
      error: (err) => console.error('Error loading related products:', err)
    });
  }

  selectImage(imageUrl: string): void {
    this.selectedImage.set(imageUrl);
  }

  selectSize(size: string): void {
    this.selectedSize.set(size);
  }

  selectColor(color: string): void {
    this.selectedColor.set(color);
  }

  increaseQuantity(): void {
    const product = this.product();
    if (product && this.quantity() < product.stockQuantity) {
      this.quantity.update(q => q + 1);
    }
  }

  decreaseQuantity(): void {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  addToCart(): void {
    const product = this.product();
    if (!product) return;

    if (!this.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    if (!this.selectedSize()) {
      alert('Please select a size');
      return;
    }

    if (!this.selectedColor()) {
      alert('Please select a color');
      return;
    }

    if (this.quantity() > product.stockQuantity) {
      alert('Insufficient stock');
      return;
    }

    // TODO: Implement cart service
    // For now, we'll just show an alert
    alert(`Added ${this.quantity()} ${product.name} to cart!`);
    
    // In a real implementation, you would:
    // 1. Add item to cart service/store
    // 2. Show success message
    // 3. Update cart count in header
  }

  buyNow(): void {
    // Similar to addToCart but redirect to checkout
    this.addToCart();
    // TODO: Navigate to checkout
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  getDiscountPercentage(originalPrice: number, currentPrice: number): number {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(1);
  }

  hasHalfStar(rating: number): boolean {
    return rating % 1 >= 0.5;
  }

  getProductImage(product: Product): string {
    return product.images && product.images.length > 0 
      ? product.images[0].url 
      : '/assets/p_img1.png';
  }
}

