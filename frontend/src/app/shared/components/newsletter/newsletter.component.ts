import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-newsletter',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './newsletter.component.html',
    styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent {
    email: string = '';

    handleSubmit() {
        console.log("Subscribed:", this.email);
        this.email = '';
        // Show a toast or message
        alert('Subscribed successfully!');
    }
}
