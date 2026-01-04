import {
  Component,
  EventEmitter,
  inject,
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
  @Input() isCompleted: boolean = false;

  @Input() isSaving: boolean = false;

  @Output() save = new EventEmitter<ScheduleAppointmentRequest>();
 formatToDDMMYYYY(date: string): string {
  return formatDate(date, 'dd/MM/yyyy', 'en-GB');
}

  form = this.fb.group({
    // requestedDate: [{ value: '', disabled: true }],
    notes: ['', Validators.maxLength(1000)],
  });

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['initialDate'] && this.initialDate) {
  //         const formattedDate = this.formatToDDMMYYYY(this.initialDate);

  //     this.form.patchValue(
  //       { requestedDate: formattedDate },
  //       { emitEvent: false }
  //     );
  //   }
  // }

  onSubmit(): void {
    if (this.form.invalid || this.isSaving) {
      return;
    }
    this.save.emit( this.form.getRawValue() as ScheduleAppointmentRequest);
  }
}
