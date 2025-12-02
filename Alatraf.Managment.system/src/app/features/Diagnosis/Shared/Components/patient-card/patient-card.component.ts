import { Patient } from './../../../../Reception/Patients/models/patient.model';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-patient-card',
  imports: [],
  templateUrl: './patient-card.component.html',
  styleUrl: './patient-card.component.css',
})
export class PatientCardComponent {
  @Input() patients!: Patient[];
  @Output() select = new EventEmitter<Patient>();
  selectedPatientId = signal<number | null>(null);
  @Input() loading = false;

  onSelect(patient: Patient): void {
    this.selectedPatientId.set(patient.patientId); // you must have 'id' in your model
    console.log("selected patient id in card:",this.selectedPatientId());
    this.select.emit(patient);
  }

  getAgeFromBirthdate(date: string | undefined): number {
    if (!date) return 0;

    const birth = new Date(date);
    if (isNaN(birth.getTime())) return 0;

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    const d = today.getDate() - birth.getDate();

    if (m < 0 || (m === 0 && d < 0)) {
      age--;
    }

    return age;
  }
}
