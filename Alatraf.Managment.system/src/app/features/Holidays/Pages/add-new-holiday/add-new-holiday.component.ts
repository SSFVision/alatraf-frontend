import {
  Component,
  EnvironmentInjector,
  effect,
  inject,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { HolidayType } from '../../Models/holiday-type.enum';
import { CreateHolidayRequest } from '../../Models/create-holiday.request';
import { UpdateHolidayRequest } from '../../Models/update-holiday.request';
import { HolidaysFacade } from '../../services/holidays.facade.service';
import { FormValidationState } from '../../../../core/utils/form-validation-state';
import { PositiveNumberDirective } from '../../../../shared/Directives/positive-number.directive';
import { HolidayDto } from '../../Models/holiday.dto';
import { HolidaysNavigationFacade } from '../../../../core/navigation/Holidays-navigation.facade';

@Component({
  selector: 'app-add-new-holiday',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf, PositiveNumberDirective],
  templateUrl: './add-new-holiday.component.html',
  styleUrl: './add-new-holiday.component.css',
})
export class AddNewHolidayComponent {
  private fb = inject(FormBuilder);
  private facade = inject(HolidaysFacade);
  private env = inject(EnvironmentInjector);
  private route = inject(ActivatedRoute);

  private validationState!: FormValidationState;

  private currentHolidayId: number | null = null;
  isEditMode = signal(false);

  holidayTypes = [
    { label: 'ثابتة', value: HolidayType.Fixed },
    { label: 'مؤقتة', value: HolidayType.Temporary },
  ];

  months = [
    { label: 'يناير', value: 1 },
    { label: 'فبراير', value: 2 },
    { label: 'مارس', value: 3 },
    { label: 'أبريل', value: 4 },
    { label: 'مايو', value: 5 },
    { label: 'يونيو', value: 6 },
    { label: 'يوليو', value: 7 },
    { label: 'أغسطس', value: 8 },
    { label: 'سبتمبر', value: 9 },
    { label: 'أكتوبر', value: 10 },
    { label: 'نوفمبر', value: 11 },
    { label: 'ديسمبر', value: 12 },
  ];

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    isRecurring: [false],
    type: [HolidayType.Fixed, Validators.required],
    isActive: [true],
    fixedMonth: [1],
    fixedDay: [1],
  });

  isSubmitting = false;
  isSubmitted = false;

  today = new Date().toISOString().split('T')[0];

  ngOnInit(): void {
    this.validationState = new FormValidationState(
      this.form,
      this.facade.formValidationErrors
    );

    runInInjectionContext(this.env, () => {
      effect(() => {
        this.validationState.apply();
      });

      effect(() => {
        const selected = this.facade.selectedHoliday();
        if (
          this.isEditMode() &&
          selected &&
          selected.holidayId === this.currentHolidayId
        ) {
          this.patchFormForHoliday(selected);
        }
      });
    });

    this.validationState.clearOnEdit();

    this.setupTypeReactiveBehavior();

    this.detectEditMode();

    this.setupSubmitResetOnChange();
  }

  get daysCount(): number | null {
    if (this.form.value.type === HolidayType.Fixed) {
      return 1;
    }

    const start = this.form.value.startDate;
    const end = this.form.value.endDate || this.form.value.startDate;
    if (!start) return null;
    const startDate = new Date(start as string);
    const endDate = new Date(end as string);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return null;
    }
    const diffMs = endDate.getTime() - startDate.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
    return days > 0 ? days : 1;
  }

  onSubmit(): void {
    if (this.isSubmitting) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const type = raw.type as HolidayType;
    const buildFixedPayload = (): {
      startDate: string;
      endDate: null;
      name: string;
      isRecurring: true;
      type: HolidayType.Fixed;
      isActive: boolean;
    } => {
      const month = Number(raw.fixedMonth ?? 1);
      const day = Number(raw.fixedDay ?? 1);
      const yearStr = '0001';
      const startDate = `${yearStr}-${this.pad2(month)}-${this.pad2(day)}`;
      return {
        name: raw.name as string,
        startDate,
        endDate: null,
        isRecurring: true,
        type: HolidayType.Fixed,
        isActive: Boolean(raw.isActive),
      };
    };

    const buildTemporaryPayload = (): {
      startDate: string;
      endDate: string | null;
      name: string;
      isRecurring: boolean;
      type: HolidayType.Temporary;
      isActive: boolean;
    } => ({
      name: raw.name as string,
      startDate: raw.startDate as string,
      endDate: (raw.endDate as string) || null,
      isRecurring: Boolean(raw.isRecurring),
      type: HolidayType.Temporary,
      isActive: Boolean(raw.isActive),
    });

    const payloadFixed = buildFixedPayload();
    const payloadTemp = buildTemporaryPayload();

    const createPayload: CreateHolidayRequest =
      type === HolidayType.Fixed ? payloadFixed : payloadTemp;
    const updatePayload: UpdateHolidayRequest =
      type === HolidayType.Fixed ? payloadFixed : payloadTemp;

    this.isSubmitting = true;
    if (this.isEditMode() && this.currentHolidayId) {
      this.facade
        .updateHoliday(this.currentHolidayId, updatePayload)
        .subscribe({
          next: (res) => {
            if (res.success) {
              this.isSubmitted = true;
            }
          },
          error: () => {
            // allow retry on error
          },
          complete: () => {
            this.isSubmitting = false;
          },
        });
    } else {
      this.facade.createHoliday(createPayload).subscribe({
        next: (res) => {
          if (res.success) {
            this.isSubmitted = true;
          }
        },
        error: () => {
          // allow retry on error
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
    }
  }

  holidayNav=inject(HolidaysNavigationFacade);
OnCloseEditHoliday(){
this.holidayNav.goToHolidayList();

  
}
  // Helpers for template validation (match patient form pattern)
  getControl(name: string): AbstractControl | null {
    return this.form.get(name);
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

  HolidayType = HolidayType; // expose enum to template

  private detectEditMode(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const parsedId = idParam ? Number(idParam) : null;

    if (parsedId && !Number.isNaN(parsedId)) {
      this.isEditMode.set(true);
      this.currentHolidayId = parsedId;
      this.facade.getHolidayById(parsedId);
    } else {
      this.isEditMode.set(false);
      this.currentHolidayId = null;
      this.resetFormForCreate();
    }
  }

  private patchFormForHoliday(holiday: HolidayDto): void {
    if (HolidayType.Fixed === holiday.type) {
      const date = new Date(holiday.startDate);
      const month = Number.isNaN(date.getTime()) ? 1 : date.getMonth() + 1;
      const day = Number.isNaN(date.getTime()) ? 1 : date.getDate();

      this.form.patchValue(
        {
          name: holiday.name ?? '',
          type: HolidayType.Fixed,
          fixedMonth: month,
          fixedDay: day,
          isRecurring: true,
          isActive: holiday.isActive,
          startDate: '',
          endDate: '',
        },
        { emitEvent: true }
      );
    } else {
      this.form.patchValue(
        {
          name: holiday.name ?? '',
          type: HolidayType.Temporary,
          startDate: holiday.startDate,
          endDate: holiday.endDate ?? '',
          isRecurring: holiday.isRecurring,
          isActive: holiday.isActive,
          fixedMonth: 1,
          fixedDay: 1,
        },
        { emitEvent: true }
      );
    }
  }

  private resetFormForCreate(): void {
    this.form.reset({
      name: '',
      startDate: '',
      endDate: '',
      isRecurring: false,
      type: HolidayType.Fixed,
      isActive: true,
      fixedMonth: 1,
      fixedDay: 1,
    });

    const typeCtrl = this.form.get('type');
    typeCtrl?.setValue(HolidayType.Fixed, { emitEvent: true });
  }

  private setupTypeReactiveBehavior(): void {
    const typeCtrl = this.form.get('type');
    const startCtrl = this.form.get('startDate');
    const endCtrl = this.form.get('endDate');
    const isRecurringCtrl = this.form.get('isRecurring');
    const fixedMonthCtrl = this.form.get('fixedMonth');
    const fixedDayCtrl = this.form.get('fixedDay');
    const isActiveCtrl = this.form.get('isActive');

    typeCtrl?.valueChanges.subscribe((val) => {
      const v = (val ?? HolidayType.Fixed) as HolidayType;
      if (v === HolidayType.Fixed) {
        startCtrl?.clearValidators();
        endCtrl?.clearValidators();
        startCtrl?.updateValueAndValidity();
        endCtrl?.updateValueAndValidity();

        fixedMonthCtrl?.setValidators([Validators.required]);
        fixedDayCtrl?.setValidators([Validators.required]);
        fixedMonthCtrl?.updateValueAndValidity();
        fixedDayCtrl?.updateValueAndValidity();

        isRecurringCtrl?.setValue(true);
        isRecurringCtrl?.disable({ emitEvent: false });
        // Fixed holidays are always active by definition in this flow
        isActiveCtrl?.setValue(true, { emitEvent: false });
      } else {
        startCtrl?.setValidators([
          Validators.required,
          this.notPastTodayValidator(),
        ]);
        endCtrl?.setValidators([this.endNotBeforeStartValidator()]);
        startCtrl?.updateValueAndValidity();
        endCtrl?.updateValueAndValidity();

        fixedMonthCtrl?.clearValidators();
        fixedDayCtrl?.clearValidators();
        fixedMonthCtrl?.updateValueAndValidity();
        fixedDayCtrl?.updateValueAndValidity();

        isRecurringCtrl?.enable({ emitEvent: false });
      }
    });

    const initType = typeCtrl?.value as HolidayType;
    typeCtrl?.setValue(initType, { emitEvent: true });

    fixedMonthCtrl?.valueChanges.subscribe((m) => {
      const month = (m ?? 1) as number;
      const max = this.maxDayForMonth(Number(month));
      const current = Number(fixedDayCtrl?.value ?? 1);
      if (current > max) fixedDayCtrl?.setValue(max);
    });

    fixedDayCtrl?.valueChanges.subscribe((d) => {
      const day = Number(d ?? 1);
      const max = this.maxDayForMonth(Number(fixedMonthCtrl?.value ?? 1));
      if (day > max) {
        fixedDayCtrl?.setValue(max);
      } else if (day < 1) {
        fixedDayCtrl?.setValue(1);
      }
    });
  }

  private setupSubmitResetOnChange(): void {
    this.form.valueChanges.subscribe(() => {
      if (this.isSubmitted && !this.isSubmitting) {
        this.isSubmitted = false;
      }
    });
  }

  private pad2(n: number): string {
    return String(n).padStart(2, '0');
  }

  maxDayForMonth(month: number): number {
    const year = new Date().getFullYear();
    return new Date(year, month, 0).getDate();
  }

  private notPastTodayValidator() {
    return (control: AbstractControl) => {
      const value = control.value;
      if (!value) return null;
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return null;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (d < today) {
        return { pastDate: true };
      }
      return null;
    };
  }

  private endNotBeforeStartValidator() {
    return (control: AbstractControl) => {
      const endVal = control.value;
      if (!endVal) return null; // optional
      const startVal = this.form?.get('startDate')?.value;
      if (!startVal) return null;
      const start = new Date(startVal);
      const end = new Date(endVal);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
        return null;
      if (end < start) {
        return { beforeStart: true };
      }
      return null;
    };
  }
}
