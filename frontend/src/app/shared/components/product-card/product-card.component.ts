import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-product-card',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './product-card.component.html',
    styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
    @Input() id!: string;
    @Input() name!: string;
    @Input() price!: number;
    @Input() image!: string | string[];

    get imageUrl(): string {
        // Handle both string and array inputs
        if (Array.isArray(this.image)) {
            return this.image[0] || '';
        }
        return this.image || '';
    }
}
