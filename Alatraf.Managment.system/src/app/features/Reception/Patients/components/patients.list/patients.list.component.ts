import { finalize } from 'rxjs';
import { Component, inject, input, output } from '@angular/core';
import { SkeletonComponent } from '../../../../../shared/components/skeleton/skeleton.component';
import { SkeletonsLoadingService } from '../../../../../core/services/skeletons-loading.service';
import { NavigationReceptionFacade } from '../../../../../core/navigation/navigation-reception.facade';
import { StopPropagationDirective } from '../../../../../shared/Directives/stop-propagation.directive';
import { AuthFacade } from '../../../../../core/auth/auth.facade';
import { PERMISSIONS } from '../../../../../core/auth/models/permissions.map';
import { HasPermissionDirective } from '../../../../../core/auth/directives/has-permission.directive';
import { PatientsFacade } from '../../Services/patients.facade.service';
import { UiLockService } from '../../../../../core/services/ui-lock.service';
import { PatientDto } from '../../../../../core/models/Shared/patient.model';

@Component({
  selector: 'app-patients-list',
  imports: [
    SkeletonComponent,
    StopPropagationDirective,
    // HasPermissionDirective,
  ],
  standalone: true,
  templateUrl: './patients.list.component.html',
  styleUrl: './patients.list.component.css',
})
export class PatientsListComponent {
 patients = input.required<PatientDto[]>();

  pageLoader = inject(SkeletonsLoadingService);
  private uiLock = inject(UiLockService);

  private navReception = inject(NavigationReceptionFacade);

  permession = PERMISSIONS;
  skeletonRows = Array.from({ length: 8 }).map((_, i) => i);

  // UPDATED OUTPUT TYPE
  deletePatient = output<PatientDto>();

  onDeleteClick(patient: PatientDto) {
    this.deletePatient.emit(patient);
  }

  OnEditPatient(patient: PatientDto) {
    this.navReception.goToPatientsEdit(patient.patientId);
  }

  OnCreateTicket(patient: PatientDto) {
    this.navReception.goToTicketsCreate(patient.patientId);
  }

  OnShowPatient(patientId: number) {
    this.navReception.goToPatientsView(patientId);
  }
}
