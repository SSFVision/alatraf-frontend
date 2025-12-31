import { Component, signal } from '@angular/core';
import { GeneralWaitingPatientQueueComponent } from "../../../../../shared/components/general-waiting-patient-queue/general-waiting-patient-queue.component";
import { GeneralWaitingPatientVM } from '../../../../../shared/models/general-waiting-patient.vm';

@Component({
  selector: 'app-doctor-assigments-page',
  imports: [GeneralWaitingPatientQueueComponent],
  templateUrl: './doctor-assigments-page.component.html',
  styleUrl: './doctor-assigments-page.component.css'
})
export class DoctorAssigmentsPageComponent {
patientsVM = signal<GeneralWaitingPatientVM[]>(
  GENERAL_WAITING_PATIENTS_DUMMY_DATA
);

}
export const GENERAL_WAITING_PATIENTS_DUMMY_DATA: GeneralWaitingPatientVM[] = [
  {
    id: 1,
    patientNumber: 1001,
    cardNumber: 501,
    fullName: 'أحمد محمد علي',
    gender: 'ذكر',
  },
 
];
