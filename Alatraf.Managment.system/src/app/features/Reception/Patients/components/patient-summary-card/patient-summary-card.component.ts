import { Component, inject, input, Input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Patient } from '../../models/patient.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-summary-card',
  imports: [DatePipe],
  templateUrl: './patient-summary-card.component.html',
  styleUrl: './patient-summary-card.component.css',
})
export class PatientSummaryCardComponent {
  patient = input<Patient | null>(null);
  close = output();

  private rout = inject(Router);

  onClose() {
    this.closeDialog();
  }

  closeDialog() {
    this.rout.navigate(['./']);
  }
}
