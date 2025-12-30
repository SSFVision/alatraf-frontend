import { Component, input, signal } from '@angular/core';
import { GeneralWaitingPatientQueueComponent } from '../../../../../shared/components/general-waiting-patient-queue/general-waiting-patient-queue.component';
import { GeneralWaitingPatientVM } from '../../../../../shared/models/general-waiting-patient.vm';
import { DoctorDto } from '../../Models/doctor.dto';

@Component({
  selector: 'app-assign-doctor-section',
  standalone: true,
  imports: [],
  templateUrl: './assign-doctor-section.component.html',
  styleUrl: './assign-doctor-section.component.css',
})
export class AssignDoctorSectionComponent {
  selectedDoctor = input<DoctorDto | null>(null);
}
