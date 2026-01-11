import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../services/toast.service';
import { LucideAngularModule, CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-angular';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './toast.component.html',
    styleUrls: []
})
export class ToastComponent implements OnInit {
    toasts: Toast[] = [];

    readonly CheckCircle = CheckCircle;
    readonly AlertCircle = AlertCircle;
    readonly Info = Info;
    readonly XCircle = XCircle;
    readonly X = X;

    constructor(private toastService: ToastService) { }

    ngOnInit(): void {
        this.toastService.toasts$.subscribe(toasts => {
            this.toasts = toasts;
        });
    }

    remove(id: number) {
        this.toastService.remove(id);
    }

    getIcon(type: string) {
        switch (type) {
            case 'success': return this.CheckCircle;
            case 'error': return this.XCircle;
            case 'warning': return this.AlertCircle;
            default: return this.Info;
        }
    }

    getIconColorClass(type: string) {
        switch (type) {
            case 'success': return 'text-green-600';
            case 'error': return 'text-red-600';
            case 'warning': return 'text-yellow-600';
            default: return 'text-blue-600';
        }
    }

    getColorClass(type: string) {
        switch (type) {
            case 'success': return 'bg-white text-foreground border-green-500';
            case 'error': return 'bg-white text-foreground border-red-500';
            case 'warning': return 'bg-white text-foreground border-yellow-500';
            default: return 'bg-white text-foreground border-blue-500';
        }
    }
}
