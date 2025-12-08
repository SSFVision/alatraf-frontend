import { Component, input, signal, OnInit } from '@angular/core';
import { Patient } from '../../../../Reception/Patients/models/patient.model';
import { calculateAge } from '../../Util/patient-ticket.helpers';

@Component({
  selector: 'app-header-patient-info',
  imports: [],
  templateUrl: './header-patient-info.component.html',
  styleUrl: './header-patient-info.component.css',
})
export class HeaderPatientInfoComponent {
  patient = input<Patient>();

  getAgeFromBirthdate(date: string | undefined): number {
  return calculateAge(date);
  }
}
