import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ScheduleAppointmentRequest } from '../../../Reception/Tickets/models/schedule-appointment.request';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-schedule-appointment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],  templateUrl: './schedule-appointment-form.component.html',
  styleUrl: './schedule-appointment-form.component.css'
})
export class ScheduleAppointmentFormComponent {
private fb = inject(FormBuilder);
  @Input() initialDate: string | null | undefined;
    @Input() isCompleted: boolean = false;

  @Input() isSaving: boolean = false;

  @Output() save = new EventEmitter<ScheduleAppointmentRequest>();

  form = this.fb.group({
    requestedDate: [''], 
    notes: ['', Validators.maxLength(1000)],
  });


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialDate'] && this.initialDate) {
      this.form.patchValue({ requestedDate: this.initialDate });
    }
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSaving) {
      return;
    }
    this.save.emit(this.form.value as ScheduleAppointmentRequest);
  }
}
