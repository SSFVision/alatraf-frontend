import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { FilterEnum } from '../../../Pyments/Pages/main-payment-waiting-list/main-payment-waiting-list.component';
import { PatientsFacade } from '../../../Reception/Patients/Services/patients.facade.service';
import { Patient } from '../../../Reception/Patients/models/patient.model';
import { AppointmentsNavigationFacade } from '../../../../core/navigation/Appointments-navigation.facade';
import { PatientCardComponent } from "../../../Diagnosis/Shared/Components/waiting-patient-card/waiting-patient-card.component";
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-main-apointment-waiting-patient',
  imports: [RouterOutlet],
  templateUrl: './main-apointment-waiting-patient.component.html',
  styleUrl: './main-apointment-waiting-patient.component.css'
})
export class MainApointmentWaitingPatientComponent {
 selectedPatient = signal<Patient | null>(null);
  private facade = inject(PatientsFacade);
  patients = this.facade.patients;
  private nav = inject(AppointmentsNavigationFacade);
   private toast = inject(ToastService);
 
  ngOnInit() {
    this.facade.loadPatients();
  }
  onSearch(term: string) {
    this.facade.search(term);
    this.ResetSelectedPatient();
  }
  selectPatient(patient: Patient) {
    this.selectedPatient.set(patient);
    this.nav.goToSchedulaPage(patient.patientId);
  }
OnAddHoliday(){
  this.toast.warning("I will fix and add the add holiday page later ")
  // this.nav.goToAddNewHolidayPage();
}

  private ResetSelectedPatient() {
    this.selectedPatient.set(null);
  }
}
