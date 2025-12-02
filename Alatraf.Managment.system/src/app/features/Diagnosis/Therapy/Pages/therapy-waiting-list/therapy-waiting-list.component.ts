import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PatientCardComponent } from '../../../Shared/Components/patient-card/patient-card.component';
import { Patient } from '../../../../Reception/Patients/models/patient.model';
import { PatientService } from '../../../../Reception/Patients/Services/patient.service';
import { PatientsFacade } from '../../../../Reception/Patients/Services/patients.facade.service';
import { NavigationDiagnosisFacade } from '../../../../../core/navigation/navigation-diagnosis.facade';

@Component({
  selector: 'app-therapy-waiting-list',
  imports: [RouterOutlet, PatientCardComponent],
  templateUrl: './therapy-waiting-list.component.html',
  styleUrl: './therapy-waiting-list.component.css',
})
export class TherapyWaitingListComponent implements OnInit {
  selectedPatient = signal<any>(null);
  private patientsService = inject(PatientsFacade);
  patients = this.patientsService.patients;
  private navDiagnos = inject(NavigationDiagnosisFacade);
  ngOnInit() {
    this.patientsService.loadPatients();
  }

  selectPatient(patient: Patient) {
    console.log('selected : ', patient);
    this.selectedPatient.set(patient);
    this.navDiagnos.goToTherapyCreate(patient.patientId);
  }
}
