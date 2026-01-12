import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserDetailsDto } from '../../../../core/auth/models/user-details.dto.';
import { UsersNavigationFacade } from '../../../../core/navigation/users-navigation.facade';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
})
export class UserDetailsComponent {
  private toast = inject(ToastService);
  private userNav = inject(UsersNavigationFacade);
  user = input<UserDetailsDto | null>(null);
  isLoading = input(false);
  onRestPasswordClick() {
    const currentUser = this.user();

    if (!currentUser?.userId) {
      this.toast.warning('تعذر تحديد المستخدم.');
      return;
    }

    this.userNav.goToResetPasswordPage(currentUser.userId);
  }
}
