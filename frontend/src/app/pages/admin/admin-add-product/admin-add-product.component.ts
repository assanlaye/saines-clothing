import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-admin-add-product',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './admin-add-product.component.html',
    styleUrls: ['./admin-add-product.component.css']
})
export class AdminAddProductComponent {
    productForm: FormGroup;
    loading = false;
    availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];
    selectedSizes: string[] = [];

    // Track images locally for UI
    images: (File | null)[] = [null, null, null, null];
    imagePreviews: (string | null)[] = [null, null, null, null];

    constructor(
        private fb: FormBuilder,
        private productService: ProductService,
        private toastService: ToastService
    ) {
        this.productForm = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            price: ['', [Validators.required, Validators.min(1)]],
            category: ['Men', Validators.required],
            subCategory: ['Topwear', Validators.required],
            bestseller: [false]
        });
    }

    onFileChange(event: any, index: number) {
        const file = event.target.files[0];
        if (file) {
            this.images[index] = file;
            const reader = new FileReader();
            reader.onload = () => {
                this.imagePreviews[index] = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    toggleSize(size: string) {
        if (this.selectedSizes.includes(size)) {
            this.selectedSizes = this.selectedSizes.filter(s => s !== size);
        } else {
            this.selectedSizes.push(size);
        }
    }

    async onSubmit() {
        if (this.productForm.invalid) {
            this.toastService.error('Please fill all required fields');
            this.productForm.markAllAsTouched();
            return;
        }

        if (this.selectedSizes.length === 0) {
            this.toastService.error('Please select at least one size');
            return;
        }

        const validImages = this.images.filter(img => img !== null) as File[];
        if (validImages.length === 0) {
            this.toastService.error('Please upload at least one image');
            return;
        }

        this.loading = true;
        try {
            const formData = new FormData();

            // Append basic fields
            formData.append('name', this.productForm.value.name);
            formData.append('description', this.productForm.value.description);
            formData.append('price', this.productForm.value.price.toString());
            formData.append('category', this.productForm.value.category);
            formData.append('subCategory', this.productForm.value.subCategory);
            formData.append('bestseller', this.productForm.value.bestseller.toString());
            formData.append('sizes', JSON.stringify(this.selectedSizes));

            // Append images
            validImages.forEach((image) => {
                formData.append('images', image);
            });

            const response = await this.productService.addProduct(formData);
            if (response.success) {
                this.toastService.success('Product added successfully!');
                this.productForm.reset({ category: 'Men', subCategory: 'Topwear', bestseller: false });
                this.selectedSizes = [];
                this.images = [null, null, null, null];
                this.imagePreviews = [null, null, null, null];
            } else {
                this.toastService.error(response.message);
            }
        } catch (error) {
            console.error('Error adding product:', error);
            this.toastService.error('Failed to add product');
        } finally {
            this.loading = false;
        }
    }
}
