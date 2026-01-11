import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserDetailsDto } from '../../../../core/auth/models/user-details.dto.';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
})
export class UserDetailsComponent {

  private toast=inject(ToastService);
  user = input<UserDetailsDto | null>(null);
  isLoading = input(false);
  onRestPasswordClick() {
this.toast.warning('ميزة قيد التطوير حالياً');

  }
}
