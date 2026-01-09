import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../core/services/alert/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.html'
})
export class AlertComponent {
  constructor(public alertService: AlertService) { }
}
