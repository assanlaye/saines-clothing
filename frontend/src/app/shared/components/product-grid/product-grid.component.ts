import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '../../../models/product.model';

@Component({
    selector: 'app-product-grid',
    standalone: true,
    imports: [CommonModule, ProductCardComponent],
    templateUrl: './product-grid.component.html',
    styleUrls: ['./product-grid.component.css']
})
export class ProductGridComponent {
    @Input() title: string = '';
    @Input() subtitle: string = '';
    @Input() products: Product[] = [];

    get titleParts() {
        if (!this.title) return { main: '', last: '' };
        const parts = this.title.split(' ');
        if (parts.length <= 1) return { main: this.title, last: '' };
        return {
            main: parts.slice(0, -1).join(' '),
            last: parts[parts.length - 1]
        };
    }
}
