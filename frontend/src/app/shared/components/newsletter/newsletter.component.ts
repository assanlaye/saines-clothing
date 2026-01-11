import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-newsletter',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './newsletter.component.html',
    styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent {
    email: string = '';

    constructor(private toastService: ToastService) { }

    handleSubmit() {
        console.log("Subscribed:", this.email);
        this.email = '';
        this.toastService.success('Subscribed successfully!');
    }
}
