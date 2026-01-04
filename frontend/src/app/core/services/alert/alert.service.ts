import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Alert {
  type: 'success' | 'danger' | 'info' | 'warning';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new BehaviorSubject<Alert | null>(null);
  alert$ = this.alertSubject.asObservable();

  success(message: string, timeout = 3000) {
    this.showAlert({ type: 'success', message }, timeout);
  }

  error(message: string, timeout = 3000) {
    this.showAlert({ type: 'danger', message }, timeout);
  }

  info(message: string, timeout = 3000) {
    this.showAlert({ type: 'info', message }, timeout);
  }

  private showAlert(alert: Alert, timeout: number) {
    this.alertSubject.next(alert);
    setTimeout(() => {
      this.clear();
    }, timeout);
  }

  clear() {
    this.alertSubject.next(null);
  }
}
