import { Component, inject, input, Input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Patient } from '../../models/patient.model';
import { NavigationReceptionFacade } from '../../../../../core/navigation/navigation-reception.facade';

@Component({
  selector: 'app-patient-summary-card',
  imports: [DatePipe],
  templateUrl: './patient-summary-card.component.html',
  styleUrl: './patient-summary-card.component.css',
})
export class PatientSummaryCardComponent {
  patient = input<Patient | null>(null);
  close = output();

  private nav = inject(NavigationReceptionFacade);

  onClose() {
    this.closeDialog();
  }

  closeDialog() {
    console.log('Go To Patients List');
    this.nav.goToPatientsList();
  }
}
