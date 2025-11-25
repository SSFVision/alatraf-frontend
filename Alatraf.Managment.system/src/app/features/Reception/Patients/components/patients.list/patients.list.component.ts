import { Component, inject, input, output } from '@angular/core';
import { Patient } from '../../models/patient.model';
import { SkeletonComponent } from '../../../../../shared/components/skeleton/skeleton.component';
import { SkeletonsLoadingService } from '../../../../../core/services/skeletons-loading.service';
import { NavigationReceptionFacade } from '../../../../../core/navigation/navigation-reception.facade';
import { StopPropagationDirective } from '../../../../../shared/Directives/stop-propagation.directive';
import { AuthFacade } from '../../../../../core/auth/auth.facade';
import { PERMISSIONS } from '../../../../../core/auth/models/permissions.map';
import { HasPermissionDirective } from '../../../../../core/auth/directives/has-permission.directive';

@Component({
  selector: 'app-patients-list',
  imports: [
    SkeletonComponent,
    StopPropagationDirective,
    HasPermissionDirective,
  ],
  standalone: true,
  templateUrl: './patients.list.component.html',
  styleUrl: './patients.list.component.css',
})
export class PatientsListComponent {
  patients = input.required<Patient[]>();
  pageLoader = inject(SkeletonsLoadingService);
  private navReception = inject(NavigationReceptionFacade);
  permession = PERMISSIONS;
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
  OnShowPatient(patientId: number) {
    this.navReception.goToPatientsView(patientId);
  }
}
