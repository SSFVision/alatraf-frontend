import { CommonModule, NgFor } from '@angular/common';
import { Component, forwardRef, inject, OnInit, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ServiceDto } from '../../../core/models/Shared/service.model';
import { OrganizationServiceService } from '../../../features/Organization/Services/Service/service.service';

@Component({
  selector: 'app-service-select',
  imports: [NgFor,CommonModule],
  templateUrl: './service-select.component.html',
  styleUrl: './service-select.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ServiceSelectComponent),
      multi: true,
    },
  ],
})
export class ServiceSelectComponent implements OnInit, ControlValueAccessor {
  services = signal<ServiceDto[]>([]);
  disabled = false;

  private serviceApi = inject(OrganizationServiceService);

  private onChange = (value: any) => {};
  private onTouched = () => {};

  ngOnInit(): void {
    this.serviceApi.getServices().subscribe(res => {
      if (res.isSuccess && res.data) {
        this.services.set(res.data);
      }
    });
  }

  writeValue(value: any): void {}

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelectChange(value: string) {
    this.onChange(Number(value));
  }

  // Public wrapper so template can call it
  markAsTouched() {
    this.onTouched();
  }
}
