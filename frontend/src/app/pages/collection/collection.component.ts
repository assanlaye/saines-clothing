import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, ChevronRight, Search, SlidersHorizontal, X } from 'lucide-angular';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
    selector: 'app-collection',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        LucideAngularModule,
        ProductCardComponent
    ],
    templateUrl: './collection.component.html',
    styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {
    showFilter = false;
    searchQuery = '';
    sortBy = 'relevant';
    allProducts: Product[] = [];
    filteredProducts: Product[] = [];

    categories = ['Men', 'Women', 'Kids'];
    types = ['Topwear', 'Bottomwear', 'Winterwear'];

    selectedCategories: string[] = [];
    selectedTypes: string[] = [];

    readonly ChevronRight = ChevronRight;
    readonly Search = Search;
    readonly SlidersHorizontal = SlidersHorizontal;
    readonly X = X;

    constructor(private productService: ProductService) { }

    ngOnInit(): void {
        this.productService.getProducts().subscribe({
            next: (products: Product[]) => {
                console.log('Products received in CollectionComponent:', products);
                console.log('Products length:', products?.length);
                this.allProducts = products || [];
                this.applyFilters();
            },
            error: (error) => {
                console.error('Error fetching products:', error);
                this.allProducts = [];
                this.filteredProducts = [];
            }
        });
    }

    toggleCategory(category: string) {
        if (this.selectedCategories.includes(category)) {
            this.selectedCategories = this.selectedCategories.filter(c => c !== category);
        } else {
            this.selectedCategories.push(category);
        }
        this.applyFilters();
    }

    toggleType(type: string) {
        if (this.selectedTypes.includes(type)) {
            this.selectedTypes = this.selectedTypes.filter(t => t !== type);
        } else {
            this.selectedTypes.push(type);
        }
        this.applyFilters();
    }

    applyFilters() {
        let result = [...this.allProducts];

        // Filter by search query
        if (this.searchQuery) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }

        // Filter by category
        if (this.selectedCategories.length > 0) {
            result = result.filter(p => this.selectedCategories.includes(p.category));
        }

        // Filter by type
        if (this.selectedTypes.length > 0) {
            result = result.filter(p => this.selectedTypes.includes(p.subCategory));
        }

        // Sort
        if (this.sortBy === 'low-high') {
            result.sort((a, b) => a.price - b.price);
        } else if (this.sortBy === 'high-low') {
            result.sort((a, b) => b.price - a.price);
        }

        this.filteredProducts = result;
    }
}
