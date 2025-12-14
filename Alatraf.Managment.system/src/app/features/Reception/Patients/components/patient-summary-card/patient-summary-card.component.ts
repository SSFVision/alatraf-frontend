import { DatePipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';

import { PatientDto } from '../../../../../core/models/Shared/patient.model';
import {
  NavigationReceptionFacade
} from '../../../../../core/navigation/navigation-reception.facade';

@Component({
  selector: 'app-patient-summary-card',
  standalone: true,
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
