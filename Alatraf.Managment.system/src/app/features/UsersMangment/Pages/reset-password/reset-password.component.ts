import { CommonModule } from '@angular/common';
import {
  Component,
  EnvironmentInjector,
  OnInit,
  effect,
  inject,
  runInInjectionContext,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { UsersNavigationFacade } from '../../../../core/navigation/users-navigation.facade';
import { FormValidationState } from '../../../../core/utils/form-validation-state';
import { ResetPasswordRequest } from '../../Models/reset-password.request';
import { UsersFacadeService } from '../../Services/users.facade.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private usersFacade = inject(UsersFacadeService);
  private userNav = inject(UsersNavigationFacade);
  private env = inject(EnvironmentInjector);

  isSubmitting = signal(false);
  submissionDone = signal(false);
  submitted = signal(false);

  form: FormGroup = this.fb.group({
    newPassword: ['', Validators.required],
  });

  private validationState = new FormValidationState(
    this.form,
    this.usersFacade.formValidationErrors
  );

  currentUserId: string | null = null;

  ngOnInit(): void {
    this.listenToRoute();

    runInInjectionContext(this.env, () => {
      effect(() => {
        this.validationState.apply();
      });
    });

    this.validationState.clearOnEdit();
  }
  private listenToRoute() {
    this.route.paramMap.subscribe((params) => {
      this.currentUserId = params.get('userId');
    });
  }
  onSubmit() {
    this.submitted.set(true);

    if (!this.currentUserId) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    const dto: ResetPasswordRequest = {
      newPassword: raw.newPassword ?? '',
    };

    this.isSubmitting.set(true);
    this.form.disable({ emitEvent: false });

    this.usersFacade
      .resetPassword(this.currentUserId, dto)
      .pipe(
        finalize(() => {
          this.isSubmitting.set(false);
          if (!this.submissionDone()) {
            this.form.enable({ emitEvent: false });
          }
        })
      )
      .subscribe((result) => {
        if (result.success && !result.validationErrors) {
          this.submissionDone.set(true);
          this.form.disable({ emitEvent: false });
          this.onClose();
        }
      });
  }

  onClose() {
    if (this.currentUserId) {
      this.userNav.goToEditUserPage(this.currentUserId);
      return;
    }

    this.userNav.goToUsersMainPage();
  }

  getBackendError(controlName: string): string | null {
    return this.validationState.getBackendError(controlName);
  }

  hasBackendError(controlName: string): boolean {
    return this.validationState.hasBackendError(controlName);
  }

  hasFrontendError(controlName: string): boolean {
    return this.validationState.hasFrontendError(controlName);
  }
}
