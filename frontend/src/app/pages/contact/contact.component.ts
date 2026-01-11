import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ChevronRight } from 'lucide-angular';
import { NewsletterComponent } from '../../shared/components/newsletter/newsletter.component';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule, RouterModule, LucideAngularModule, NewsletterComponent],
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css']
})
export class ContactComponent {
    readonly ChevronRight = ChevronRight;
}
