import { PaymentsNavigationFacade } from './../../../../core/navigation/payments-navigation.facade';
import { Component, inject, signal } from '@angular/core';
import { NavigationDiagnosisFacade } from '../../../../core/navigation/navigation-diagnosis.facade';
import { PatientsFacade } from '../../../Reception/Patients/Services/patients.facade.service';
import { PatientCardComponent } from '../../../Diagnosis/Shared/Components/waiting-patient-card/waiting-patient-card.component';
import { RouterOutlet } from '@angular/router';
import { Patient } from '../../../Reception/Patients/models/patient.model';
export enum FilterEnum {
  All = 0,
  Therapy = 1, // علاج طبيعي
  Industrual = 2, // أعصاب
}
@Component({
  selector: 'app-main-payment-waiting-list',
  imports: [ RouterOutlet],
  templateUrl: './main-payment-waiting-list.component.html',
  styleUrl: './main-payment-waiting-list.component.css',
})
export class MainPaymentWaitingListComponent {
  selectedPatient = signal<Patient | null>(null);
  private facade = inject(PatientsFacade);
  patients = this.facade.patients;
  private navPyment = inject(PaymentsNavigationFacade);
  currentActiveFilter: FilterEnum = FilterEnum.All;

  ngOnInit() {
    this.facade.loadPatients();
  }
  onSearch(term: string) {
    this.facade.search(term);
    this.ResetSelectedPatient();
  }

  selectPatient(patient: Patient) {
    this.selectedPatient.set(patient);
    this.navPyment.goToPaiedPage(patient.patientId);
  }
  SelectFilter(currentValue: FilterEnum) {
    this.currentActiveFilter = currentValue;
    this.ResetSelectedPatient();
  }

  private ResetSelectedPatient() {
    this.selectedPatient.set(null);
  }
}
