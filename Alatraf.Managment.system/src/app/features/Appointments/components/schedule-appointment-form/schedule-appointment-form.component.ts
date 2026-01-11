import {
  Component,
  EventEmitter,
  inject,
  input,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ScheduleAppointmentRequest } from '../../../Reception/Tickets/models/schedule-appointment.request';
import { CommonModule, formatDate } from '@angular/common';

@Component({
  selector: 'app-schedule-appointment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './schedule-appointment-form.component.html',
  styleUrl: './schedule-appointment-form.component.css',
})
export class ScheduleAppointmentFormComponent {
  private fb = inject(FormBuilder);
  @Input() initialDate: string | null | undefined;
  isCompleted = input<boolean>(false);
  @Input() isSaving: boolean = false;

  @Output() save = new EventEmitter<ScheduleAppointmentRequest>();
  formatToDDMMYYYY(date: string): string {
    console.log('initialDate', date);
    return formatDate(date, 'dd/MM/yyyy', 'en-GB');
  }

  form = this.fb.group({
    notes: ['', Validators.maxLength(1000)],
  });

  onSubmit(): void {
    if (this.form.invalid || this.isSaving) {
      return;
    }
    this.save.emit(this.form.getRawValue() as ScheduleAppointmentRequest);
  }
}
