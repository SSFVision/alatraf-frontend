import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-toast-container',
  imports: [NgFor, CommonModule],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.css'
})
export class ToastContainerComponent {
  toastService = inject(ToastService);

}
