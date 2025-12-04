import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PatientCardComponent } from '../../../Shared/Components/waiting-patient-card/waiting-patient-card.component';
import { Patient } from '../../../../Reception/Patients/models/patient.model';
import { PatientsFacade } from '../../../../Reception/Patients/Services/patients.facade.service';
import { NavigationDiagnosisFacade } from '../../../../../core/navigation/navigation-diagnosis.facade';

@Component({
  selector: 'app-therapy-waiting-list',
  imports: [RouterOutlet, PatientCardComponent],
  templateUrl: './therapy-waiting-list.component.html',
  styleUrl: './therapy-waiting-list.component.css',
})
export class TherapyWaitingListComponent implements OnInit {
  selectedPatient = signal<Patient |null>(null);
  private facade = inject(PatientsFacade);
  patients = this.facade.patients;
  private navDiagnos = inject(NavigationDiagnosisFacade);
  ngOnInit() {
    this.facade.loadPatients();
  }
 onSearch(term: string) {
    this.facade.search(term);
  }

  selectPatient(patient: Patient) {
    this.selectedPatient.set(patient);
    this.navDiagnos.goToTherapyCreate(patient.patientId);
  }
}
