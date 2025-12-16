import { Component, signal } from '@angular/core';
import { GeneralWaitingPatientQueueComponent } from "../../../../../shared/components/general-waiting-patient-queue/general-waiting-patient-queue.component";
import { GeneralWaitingPatientVM } from '../../../../../shared/models/general-waiting-patient.vm';

@Component({
  selector: 'app-doctor-workspace-page',
  imports: [GeneralWaitingPatientQueueComponent],
  templateUrl: './doctor-workspace-page.component.html',
  styleUrl: './doctor-workspace-page.component.css'
})
export class DoctorWorkspacePageComponent {
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
  {
    id: 2,
    patientNumber: 1002,
    cardNumber: 502,
    fullName: 'سارة عبدالله حسن',
    gender: 'أنثى',
    referenceType: 'REPAIR',
    extraInfo: 'متابعة طرف صناعي',
  },
  {
    id: 3,
    patientNumber: 1003,
    cardNumber: 503,
    fullName: 'خالد حسين صالح',
    gender: 'ذكر',
    referenceType: 'PAYMENT',
    extraInfo: 'بانتظار الدفع',
  },
  {
    id: 4,
    patientNumber: 1004,
    cardNumber: 504,
    fullName: 'مريم أحمد سالم',
    gender: 'أنثى',
    referenceType: 'APPOINTMENT',
    extraInfo: 'موعد مراجعة',
  },
  {
    id: 5,
    patientNumber: 1005,
    cardNumber: 505,
    fullName: 'يوسف علي عبدالله',
    gender: 'ذكر',
    referenceType: 'THERAPY',
    extraInfo: 'جلسة تأهيل',
  },
];
