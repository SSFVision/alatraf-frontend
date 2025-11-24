import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Patient } from '../../models/patient.model';
import { SkeletonComponent } from '../../../../../shared/components/skeleton/skeleton.component';
import { SkeletonsLoadingService } from '../../../../../core/services/skeletons-loading.service';
import { NavigationReceptionFacade } from '../../../../../core/navigation/navigation-reception.facade';

@Component({
  selector: 'app-patients-list',
  imports: [SkeletonComponent],
  standalone: true,
  templateUrl: './patients.list.component.html',
  styleUrl: './patients.list.component.css',
})
export class PatientsListComponent {
  patients = input.required<Patient[]>();
  pageLoader = inject(SkeletonsLoadingService);
  private navReception = inject(NavigationReceptionFacade);

  skeletonRows = Array.from({ length: 8 }).map((_, i) => i);

  deletePatient = output<Patient>();
  onDeleteClick(patient: Patient) {
    this.deletePatient.emit(patient);
  }

  OnEditPatient(patient: Patient) {
    this.navReception.goToPatientsEdit(patient.patientId);
  }
  OnCreateTicket(patient: Patient) {
    this.navReception.goToTicketsCreate(patient.patientId);
  }
  OnShowPatient(patientId:number){
    this.navReception.goToPatientsView(patientId)
  }
}
