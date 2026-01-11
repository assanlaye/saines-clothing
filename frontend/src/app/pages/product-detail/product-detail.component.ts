import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LucideAngularModule, ChevronRight, Star } from 'lucide-angular';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { ProductGridComponent } from '../../shared/components/product-grid/product-grid.component';

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [CommonModule, RouterModule,
        LucideAngularModule,
        ProductGridComponent
    ],
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
    product: Product | undefined;
    relatedProducts: Product[] = [];
    selectedSize = '';
    selectedImage = 0;
    productImages: string[] = [];
    sizes = ['S', 'M', 'L', 'XL', 'XXL'];

    readonly ChevronRight = ChevronRight;
    readonly Star = Star;

    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
        private cartService: CartService
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.loadProduct(id);
            }
        });
    }

    async loadProduct(id: string) {
        const product = await this.productService.getProductById(id);
        if (product) {
            this.product = product;
            // Handle both string and string[] image types
            if (Array.isArray(product.image)) {
                this.productImages = product.image.length > 0 ? product.image : [];
            } else {
                // If it's a string, use it for all images (or fetch from backend)
                this.productImages = product.image ? [product.image] : [];
            }
            this.loadRelatedProducts(product);
        }
    }

    loadRelatedProducts(product: Product) {
        this.productService.getProducts({ category: product.category }).subscribe({
            next: (products: Product[]) => {
                this.relatedProducts = products.filter((p: Product) => p._id !== product._id).slice(0, 5);
            },
            error: (err) => console.error('Error loading related products:', err)
        });
    }

    addToCart() {
        if (!this.selectedSize) {
            alert('Please select a size');
            return;
        }
        if (this.product) {
            this.cartService.addToCart(this.product, this.selectedSize);
            alert('Added to cart!');
        }
    }
}
