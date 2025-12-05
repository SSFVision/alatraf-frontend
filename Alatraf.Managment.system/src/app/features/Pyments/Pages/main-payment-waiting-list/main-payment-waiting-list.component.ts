import { Component, inject, signal } from '@angular/core';
import { NavigationDiagnosisFacade } from '../../../../core/navigation/navigation-diagnosis.facade';
import { Patient } from '../../../../mocks/patients/patient.dto';
import { PatientsFacade } from '../../../Reception/Patients/Services/patients.facade.service';
import { PatientCardComponent } from "../../../Diagnosis/Shared/Components/waiting-patient-card/waiting-patient-card.component";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-main-payment-waiting-list',
  imports: [PatientCardComponent, RouterOutlet],
  templateUrl: './main-payment-waiting-list.component.html',
  styleUrl: './main-payment-waiting-list.component.css'
})
export class MainPaymentWaitingListComponent {
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
