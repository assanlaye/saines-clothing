import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class FooterComponent {
  newsletterEmail = '';
  isLoading = false;

  constructor(private apiService: ApiService) {}

  subscribeNewsletter(): void {
    if (!this.newsletterEmail || !this.newsletterEmail.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    this.isLoading = true;
    this.apiService.post('/newsletter/subscribe', { email: this.newsletterEmail })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            alert('Successfully subscribed to newsletter!');
            this.newsletterEmail = '';
          }
          this.isLoading = false;
        },
        error: (error) => {
          alert(error.error?.message || 'Subscription failed');
          this.isLoading = false;
        }
      });
  }
}

