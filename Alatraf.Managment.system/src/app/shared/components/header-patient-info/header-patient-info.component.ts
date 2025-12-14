import { Component, input, signal, OnInit } from '@angular/core';
import { calculateAge } from '../../../features/Diagnosis/Shared/Util/patient-ticket.helpers';
import { PatientDto } from '../../../core/models/Shared/patient.model';

@Component({
  selector: 'app-header-patient-info',
  imports: [],
  templateUrl: './header-patient-info.component.html',
  styleUrl: './header-patient-info.component.css',
})
export class HeaderPatientInfoComponent {
  patient = input<PatientDto>();

  getAgeFromBirthdate(date: string | undefined): number {
    return calculateAge(date);
  }
}
