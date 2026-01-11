import {
  DialogConfig,
  DialogType,
} from '../../../../shared/components/dialog/DialogConfig';
import {
  Component,
  effect,
  EnvironmentInjector,
  inject,
  OnInit,
  runInInjectionContext,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CacheService } from '../../../../core/services/cache.service';
import { FormValidationState } from '../../../../core/utils/form-validation-state';
import {
  formatPhoneNumberInput,
  preventNonNumericInput,
  yemeniPhoneNumberValidator,
} from '../../../../core/utils/person.validators';
import { CreateUserRequest } from '../../Models/create-user.request';
import { UsersFacadeService } from '../../Services/users.facade.service';
import { CommonModule } from '@angular/common';
import { UsersNavigationFacade } from '../../../../core/navigation/users-navigation.facade';
import { ArabicSuccessMessages } from '../../../../core/locals/Arabic';
import { DialogService } from '../../../../shared/components/dialog/dialog.service';

@Component({
  selector: 'app-add-new-user-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-new-user-page.component.html',
  styleUrl: './add-new-user-page.component.css',
})
export class AddNewUserPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private facade = inject(UsersFacadeService);
  private env = inject(EnvironmentInjector);
  private dialogService = inject(DialogService);

  private userNav = inject(UsersNavigationFacade);

  form!: FormGroup;
  private validationState!: FormValidationState;

  maxDate = new Date().toISOString().split('T')[0];

  preventNonNumericInput = preventNonNumericInput;
  formatPhoneNumberInput = formatPhoneNumberInput;

  ngOnInit(): void {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      gender: [true, Validators.required],
      birthdate: [null, Validators.required],
      phone: [
        '',
        [
          Validators.required,
          Validators.maxLength(9),
          yemeniPhoneNumberValidator(),
        ],
      ],
      address: ['', Validators.required],
      nationalNo: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['ِAdmin@123', Validators.required],
      isActive: [true, Validators.required],
    });

    // Load cached draft

    this.validationState = new FormValidationState(
      this.form,
      this.facade.formValidationErrors
    );

    runInInjectionContext(this.env, () => {
      effect(() => {
        this.validationState.apply();
      });
    });

    this.validationState.clearOnEdit();
  }

  getControl(name: string): AbstractControl | null {
    return this.form.get(name);
  }

  onSave() {
    if (this.form.valid) {
      const dto: CreateUserRequest = { ...this.form.getRawValue() };

      this.facade.createUser(dto).subscribe((result) => {
        if (result.success && !result.validationErrors && result.data) {
          const newUserId = result.data.userId;
          const config: DialogConfig = {
            title: 'تم إنشاء المستخدم بنجاح',
            payload: { الاسم: dto.fullName },
            confirmText: 'إختيار دور للمستخدم',
            showCancel: false,
            type: DialogType.Success,
          };

          this.dialogService.confirm(config).subscribe((confirm) => {
            if (!confirm || !newUserId) return;

            this.userNav.goToUserRoleAssignPage(newUserId);
          });

          this.onClose();
          return;
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
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

  onClose() {
    this.userNav.goToUsersMainPage();
  }
}
