import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../services/toast.service';
import { LucideAngularModule, CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-angular';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.css']
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

    getColorClass(type: string) {
        switch (type) {
            case 'success': return 'bg-green-50 text-green-800 border-green-200';
            case 'error': return 'bg-red-50 text-red-800 border-red-200';
            case 'warning': return 'bg-yellow-50 text-yellow-800 border-yellow-200';
            default: return 'bg-blue-50 text-blue-800 border-blue-200';
        }
    }
}
