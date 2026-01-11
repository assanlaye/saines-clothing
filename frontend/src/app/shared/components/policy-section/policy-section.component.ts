import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, RefreshCw, CheckCircle, Headphones } from 'lucide-angular';

@Component({
    selector: 'app-policy-section',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './policy-section.component.html',
    styleUrls: ['./policy-section.component.css']
})
export class PolicySectionComponent {
    readonly RefreshCw = RefreshCw;
    readonly CheckCircle = CheckCircle;
    readonly Headphones = Headphones;

    policies = [
        {
            icon: this.RefreshCw,
            title: "Easy Exchange Policy",
            description: "We offer hassle free exchange policy"
        },
        {
            icon: this.CheckCircle,
            title: "7 Days Return Policy",
            description: "We provide 7 days free return policy"
        },
        {
            icon: this.Headphones,
            title: "Best Customer Support",
            description: "We provide 24/7 customer support"
        }
    ];
}
