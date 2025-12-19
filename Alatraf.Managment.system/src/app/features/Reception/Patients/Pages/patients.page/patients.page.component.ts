import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';

import { NavigationReceptionFacade } from '../../../../../core/navigation/navigation-reception.facade';
import { PatientsListComponent } from '../../components/patients.list/patients.list.component';

import { PatientsFacade } from '../../Services/patients.facade.service';

import { HasPermissionDirective } from '../../../../../core/auth/directives/has-permission.directive';
import { PERMISSIONS } from '../../../../../core/auth/models/permissions.map';
import { AuthFacade } from '../../../../../core/auth/auth.facade';
import { ToastService } from '../../../../../core/services/toast.service';
import { PatientFilterRequest } from '../../models/PatientFilterRequest';
import { PatientDto } from '../../../../../core/models/Shared/patient.model';


@Component({
  selector: 'app-patients-page',
  standalone: true,
  imports: [
    PatientsListComponent,
    RouterOutlet,
    FormsModule,
    // HasPermissionDirective,
  ],
  templateUrl: './patients.page.component.html',
  styleUrl: './patients.page.component.css',
})
export class PatientsPageComponent implements OnInit {
  private navReception = inject(NavigationReceptionFacade);
  private auth = inject(AuthFacade);
  private toast = inject(ToastService);

  private facade = inject(PatientsFacade);

  isDeleting = signal(false);

  // NEW model type
  filters: PatientFilterRequest = {};
  loading = this.facade.isLoading;

  // NEW DTO array from facade
  patients = this.facade.patients;

  permession = PERMISSIONS;

  ngOnInit() {
    this.facade.loadPatients(); // loads page 1
  }

  onSearch(term: string) {
    this.facade.search(term);
  }

  onDeletePatient(patient: PatientDto) {
    if (this.auth.hasPermission(PERMISSIONS.PATIENTS.DELETE)) {
      this.facade.deletePatient(patient);
    } else {
      this.toast.warning('لا تملك صلاحية الوصول لتنفيذ هذه العملية');
    }
  }

  onAddPatient() {
    this.navReception.goToPatientsAdd();
  }
}
