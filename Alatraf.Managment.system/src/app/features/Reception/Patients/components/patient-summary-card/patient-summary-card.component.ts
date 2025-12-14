import { Component, inject, input, Input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NavigationReceptionFacade } from '../../../../../core/navigation/navigation-reception.facade';
import { PatientDto } from '../../../../../core/models/Shared/patient.model';

@Component({
  selector: 'app-patient-summary-card',
  imports: [DatePipe],
  templateUrl: './patient-summary-card.component.html',
  styleUrl: './patient-summary-card.component.css',
})
export class PatientSummaryCardComponent {
  patient = input<PatientDto | null>(null);
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
