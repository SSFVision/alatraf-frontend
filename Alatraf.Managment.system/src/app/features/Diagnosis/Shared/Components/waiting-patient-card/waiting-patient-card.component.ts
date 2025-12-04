import { Patient } from '../../../../Reception/Patients/models/patient.model';
import {
  Component,
  EventEmitter,
  input,
  Input,
  output,
  Output,
  signal,
} from '@angular/core';
import { CalcAgeFromBirthdateHelper } from '../../Util/patient-helpers';

@Component({
  selector: 'app-waiting-patient-card',
  imports: [],
  templateUrl: './waiting-patient-card.component.html',
  styleUrl: './waiting-patient-card.component.css',
})
export class PatientCardComponent {
  patients = input<Patient[]>([]);
  select = output<Patient>();
  selectedPatientId = signal<number | null>(null);
  loading = input<boolean>(false);

  onSelect(patient: Patient): void {
    this.selectedPatientId.set(patient.patientId);
    this.select.emit(patient);
  }

  getAgeFromBirthdate(date: string | undefined): number {
    return CalcAgeFromBirthdateHelper(date);
  }
}
