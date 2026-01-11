import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { ToastService } from '../../../services/toast.service';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
    selector: 'app-admin-products',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './admin-products.component.html',
    styleUrls: []
})
export class AdminProductsComponent implements OnInit {
    products: any[] = [];
    readonly X = X;

    constructor(
        private productService: ProductService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        this.fetchProducts();
    }

    fetchProducts() {
        this.productService.getProducts().subscribe({
            next: (products) => {
                this.products = products || [];
            },
            error: (error) => {
                console.error('Error fetching products:', error);
                this.toastService.error('Failed to fetch products');
            }
        });
    }

    async deleteProduct(id: string) {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await this.productService.removeProduct(id);
            if (response.success) {
                this.toastService.success('Product removed successfully');
                this.fetchProducts();
            } else {
                this.toastService.error(response.message);
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            this.toastService.error('Failed to delete product');
        }
    }
}
