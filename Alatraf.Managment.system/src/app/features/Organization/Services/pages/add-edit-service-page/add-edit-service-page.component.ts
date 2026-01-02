import {
  Component,
  effect,
  inject,
  signal,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ServicesFacade } from '../../Service/services.facade.service';
import { CreateServiceRequest } from '../../Models/create-service.request';
import { UpdateServiceRequest } from '../../Models/update-service.request';
import { DepartmentsFacade } from '../../../Departments/departments.facade.service';
import { ServicesNavigationFacade } from '../../../../../core/navigation/services-navigation.facade';

@Component({
  selector: 'app-add-edit-service-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-edit-service-page.component.html',
  styleUrl: './add-edit-service-page.component.css',
})
export class AddEditServicePageComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private facade = inject(ServicesFacade);
  private departmentsFacade = inject(DepartmentsFacade);
  private nav = inject(ServicesNavigationFacade);
  private valueChangesSub: Subscription | null = null;

  // ---------------------------------------------
  // STATE
  // ---------------------------------------------
  isEditMode = this.facade.isEditMode;
  canDelete = signal(false);
  canSubmit = signal(false);

  // ---------------------------------------------
  // FORM
  // ---------------------------------------------
  form = this.fb.group({
    name: this.fb.nonNullable.control('', Validators.required),
    departmentId: this.fb.nonNullable.control<number | null>(null),
    price: this.fb.nonNullable.control<number | null>(null),
  });

  departments = this.departmentsFacade.departments;

  constructor() {
    this.setupEffects();
  }

  ngOnInit(): void {
    this.initDepartments();
    this.initValueChangesSubscription();
  }

  // -------------------------- Helpers --------------------------
  private setupEffects(): void {
    // When a service is selected, populate the form
    effect(() => {
      const service = this.facade.selectedService();
      if (!service) return;

      this.patchFormFromService(service);

      this.canDelete.set(true);
      this.canSubmit.set(false);
    });

    // Create mode → reset form
    effect(() => {
      if (this.isEditMode()) return;

      this.resetFormForCreateMode();
    });
  }

  private initDepartments(): void {
    this.departmentsFacade.loadDepartments();
  }

  private initValueChangesSubscription(): void {
    this.valueChangesSub = this.form.valueChanges.subscribe(() => {
      this.canSubmit.set(this.form.valid && this.form.dirty);
    });
  }

  private patchFormFromService(service: any): void {
    this.form.patchValue({
      name: service.name,
      departmentId: service.departmentId ?? null,
      price: service.price ?? null,
    });

    this.form.markAsPristine();
    this.form.enable();
  }

  private resetFormForCreateMode(): void {
    this.form.reset({ name: '', departmentId: null, price: null });
    this.form.markAsPristine();
    this.form.enable();
    this.canDelete.set(false);
    this.canSubmit.set(false);
  }

  ngOnDestroy(): void {
    this.valueChangesSub?.unsubscribe();
  }

  submit() {
    if (!this.canSubmit()) return;

    const name = this.form.controls.name.value;
    const departmentId = this.form.controls.departmentId.value ?? null;
    const price = this.form.controls.price.value ?? null;

    if (this.isEditMode()) {
      const service = this.facade.selectedService();
      if (!service) return;

      const updateDto: UpdateServiceRequest = {
        name,
        departmentId,
        price,
      };

      this.facade
        .updateService(service.serviceId, updateDto)
        .subscribe((res) => {
          if (res.success) {
            this.form.disable();
            this.form.markAsPristine();
            this.canSubmit.set(false);
            this.canDelete.set(true);
          }
        });
    } else {
      const createDto: CreateServiceRequest = {
        name,
        departmentId,
        price,
      };

      this.facade.createService(createDto).subscribe((res) => {
        if (res.success && res.data) {
          this.nav.goToEditServicePage((res.data as any).serviceId);
          this.form.markAsPristine();
          this.canDelete.set(true);
          this.canSubmit.set(false);
        }
      });
    }
  }

  delete() {
    const service = this.facade.selectedService();
    if (!service) return;

    this.facade.deleteService(service);
  }
}
