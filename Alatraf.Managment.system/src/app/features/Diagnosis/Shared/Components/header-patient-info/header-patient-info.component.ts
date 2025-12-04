import { Component, Input, input, signal, OnInit } from '@angular/core';
import { CalcAgeFromBirthdateHelper } from '../../Util/patient-helpers';
import { Patient } from '../../../../Reception/Patients/models/patient.model';

@Component({
  selector: 'app-header-patient-info',
  imports: [],
  templateUrl: './header-patient-info.component.html',
  styleUrl: './header-patient-info.component.css',
})
export class HeaderPatientInfoComponent {
  // @Input() patient!: Patient;
  patient = input<Patient>();

  getAgeFromBirthdate(date: string | undefined): number {
    return CalcAgeFromBirthdateHelper(date);
  }
}
