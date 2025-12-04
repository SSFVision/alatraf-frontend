import { Component, inject, signal } from '@angular/core';
import { PatientCardComponent } from '../../../Shared/Components/waiting-patient-card/waiting-patient-card.component';
import { RouterOutlet } from '@angular/router';
import { NavigationDiagnosisFacade } from '../../../../../core/navigation/navigation-diagnosis.facade';
import { Patient } from '../../../../Reception/Patients/models/patient.model';
import { PatientsFacade } from '../../../../Reception/Patients/Services/patients.facade.service';

@Component({
  selector: 'app-industrial-waiting-list',
  imports: [RouterOutlet, PatientCardComponent],
  templateUrl: './industrial-waiting-list.component.html',
  styleUrl: './industrial-waiting-list.component.css',
})
export class IndustrialWaitingListComponent {
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
    this.navDiagnos.goToIndustrialCreate(patient.patientId);
  }
}
