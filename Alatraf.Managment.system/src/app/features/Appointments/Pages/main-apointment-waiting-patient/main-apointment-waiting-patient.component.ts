import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { FilterEnum } from '../../../Pyments/Pages/main-payment-waiting-list/main-payment-waiting-list.component';
import { PatientsFacade } from '../../../Reception/Patients/Services/patients.facade.service';
import { AppointmentsNavigationFacade } from '../../../../core/navigation/Appointments-navigation.facade';
import { ToastService } from '../../../../core/services/toast.service';
import { PatientDto } from '../../../../core/models/Shared/patient.model';

@Component({
  selector: 'app-main-apointment-waiting-patient',
  imports: [RouterOutlet],
  templateUrl: './main-apointment-waiting-patient.component.html',
  styleUrl: './main-apointment-waiting-patient.component.css'
})
export class MainApointmentWaitingPatientComponent {
 selectedPatient = signal<PatientDto | null>(null);
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
  selectPatient(patient: PatientDto) {
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
