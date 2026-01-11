import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ChevronRight } from 'lucide-angular';
import { NewsletterComponent } from '../../shared/components/newsletter/newsletter.component';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [CommonModule, RouterModule, LucideAngularModule, NewsletterComponent],
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent {
    readonly ChevronRight = ChevronRight;
}
