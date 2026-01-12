import { CommonModule } from '@angular/common';
import {
  Component,
  EnvironmentInjector,
  OnInit,
  effect,
  inject,
  runInInjectionContext,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { finalize, throttleTime } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { UsersNavigationFacade } from '../../../../core/navigation/users-navigation.facade';
import { FormValidationState } from '../../../../core/utils/form-validation-state';
import { ChangeCredentialsRequest } from '../../Models/change-credentials.request';
import { UsersFacadeService } from '../../Services/users.facade.service';
import { signal } from '@angular/core';
import { AuthFacade } from '../../../../core/auth/auth.facade';
import { DialogService } from '../../../../shared/components/dialog/dialog.service';
import {
  DialogConfig,
  DialogType,
} from '../../../../shared/components/dialog/DialogConfig';

const requireNewCredential: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const group = control as FormGroup;
  const newPassword = group.get('newPassword')?.value;
  const newUsername = group.get('newUsername')?.value;

  if (newPassword || newUsername) return null;

  return { noCredentialChange: true };
};

@Component({
  selector: 'app-change-credentials',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-credentials.component.html',
  styleUrls: ['./change-credentials.component.css'],
})
export class ChangeCredentialsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private usersFacade = inject(UsersFacadeService);
  private authfacade = inject(AuthFacade); // temporary
  private dialogService = inject(DialogService);

  private userNav = inject(UsersNavigationFacade);
  private env = inject(EnvironmentInjector);
  isSubmitting = signal(false);
  submissionDone = signal(false);
  submitted = signal(false);

  form = this.fb.group(
    {
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      newUsername: ['', Validators.required],
    },
    { validators: requireNewCredential }
  );

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

  private confirmLogout() {
    // const config: DialogConfig = {
    //   title: ' إنشاء المستخدم تم بنجاح',
    //   payload: {
    //     message: 'سيتم تسجيل خروجك من النظام لتسجيل الدخول بالإسم الجديد.',
    //   },
    //   showCancel: false,
    //   type: DialogType.Success,
    // };
    this.dialogService
      .confirmSuccess(' سيتم تسجيل خروجك من النظام لتسجيل الدخول بالإسم الجديد',' إنشاء المستخدم تم بنجاح')
      .subscribe((confirm) => {
        if (!confirm) return;

        this.authfacade.logout(); // temporary
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

    this.isSubmitting.set(true);
    this.form.disable({ emitEvent: false });

    const changeRequest: ChangeCredentialsRequest = {
      oldPassword: raw.oldPassword ?? '',
      newPassword: raw.newPassword ?? undefined,
      newUsername: raw.newUsername ?? undefined,
    };

    this.usersFacade
      .changeCredentials(this.currentUserId, changeRequest)
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
          this.confirmLogout();
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

  get formLevelError(): string | null {
    if (this.form.errors?.['noCredentialChange']) {
      return 'أدخل اسم مستخدم جديد أو كلمة مرور جديدة.';
    }
    return null;
  }

  private listenToRoute() {
    this.route.paramMap.subscribe((params) => {
      this.currentUserId = params.get('userId');
    });
  }
}
