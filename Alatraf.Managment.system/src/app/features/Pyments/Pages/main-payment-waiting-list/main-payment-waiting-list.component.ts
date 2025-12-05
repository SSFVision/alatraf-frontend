import { PaymentsNavigationFacade } from './../../../../core/navigation/payments-navigation.facade';
import { Component, inject, signal } from '@angular/core';
import { NavigationDiagnosisFacade } from '../../../../core/navigation/navigation-diagnosis.facade';
import { PatientsFacade } from '../../../Reception/Patients/Services/patients.facade.service';
import { PatientCardComponent } from '../../../Diagnosis/Shared/Components/waiting-patient-card/waiting-patient-card.component';
import { RouterOutlet } from '@angular/router';
import { Patient } from '../../../Reception/Patients/models/patient.model';

@Component({
  selector: 'app-main-payment-waiting-list',
  imports: [PatientCardComponent, RouterOutlet],
  templateUrl: './main-payment-waiting-list.component.html',
  styleUrl: './main-payment-waiting-list.component.css',
})
export class MainPaymentWaitingListComponent {
  selectedPatient = signal<Patient | null>(null);
  private facade = inject(PatientsFacade);
  patients = this.facade.patients;
  private navPyment = inject(PaymentsNavigationFacade);
  ngOnInit() {
    this.facade.loadPatients();
  }
  onSearch(term: string) {
    this.facade.search(term);
  }

  selectPatient(patient: Patient) {
    this.selectedPatient.set(patient);
    console.log('go to the payies page');
    this.navPyment.goToPaiedPage(patient.patientId);
  }
  SelectFilter(){
    this.selectedPatient.set(null);
  }
}
