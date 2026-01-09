import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product/product.service';
import { Product } from '../../../core/models/product.model';
import { AlertService } from '../../../core/services/alert/alert.service';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html'
})
export class ProductManagementComponent implements OnInit {
  products: Product[] = [];
  productForm: FormGroup;
  loading = false;
  showAddForm = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private alertService: AlertService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['Men', Validators.required],
      type: ['Suit'], // Defaulting for simplicity
      price: ['', [Validators.required, Validators.min(0)]],
      stockQuantity: ['', [Validators.required, Validators.min(0)]],
      sizes: [['S', 'M', 'L', 'XL']] // Default sizes
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts({ limit: 100 }).subscribe({
      next: (res) => this.products = res.data,
      error: (err) => this.alertService.error('Failed to load catalog')
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    this.loading = true;
    const productData = {
      ...this.productForm.value,
      images: [{ url: 'https://images.unsplash.com/photo-1594932224456-7489e2730623?q=80&w=1481&auto=format&fit=crop', isMain: true }] // Placeholder image
    };

    this.productService.createProduct(productData).subscribe({
      next: () => {
        this.alertService.success('Product added successfully');
        this.loadProducts();
        this.showAddForm = false;
        this.loading = false;
        this.productForm.reset({ category: 'Men', type: 'Suit', sizes: ['S', 'M', 'L', 'XL'] });
      },
      error: (err) => {
        this.alertService.error('Failed to create product');
        this.loading = false;
      }
    });
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.alertService.success('Product deleted');
          this.loadProducts();
        },
        error: (err) => this.alertService.error('Failed to delete product')
      });
    }
  }
}
