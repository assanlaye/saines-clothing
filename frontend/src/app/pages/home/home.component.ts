import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../../shared/components/hero/hero.component';
import { PolicySectionComponent } from '../../shared/components/policy-section/policy-section.component';
import { NewsletterComponent } from '../../shared/components/newsletter/newsletter.component';
import { ProductGridComponent } from '../../shared/components/product-grid/product-grid.component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        HeroComponent,
        PolicySectionComponent,
        NewsletterComponent,
        ProductGridComponent
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    latestProducts: Product[] = [];
    bestSellers: Product[] = [];

    constructor(private productService: ProductService) { }

    ngOnInit(): void {
        this.productService.getProducts().subscribe((products: Product[]) => {
            this.latestProducts = products.slice(0, 10);
            this.bestSellers = products.filter((p: Product) => p.bestseller).slice(0, 5);
        });
    }
}
