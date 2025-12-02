import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Subject, from } from 'rxjs';
import { NavigationReceptionFacade } from '../../../../../core/navigation/navigation-reception.facade';
import { PatientsListComponent } from '../../components/patients.list/patients.list.component';
import { PatientFilterDto, Patient } from '../../models/patient.model';
import { PatientsFacade } from '../../Services/patients.facade.service';
import { HasPermissionDirective } from '../../../../../core/auth/directives/has-permission.directive';
import { PERMISSIONS } from '../../../../../core/auth/models/permissions.map';
import { AuthFacade } from '../../../../../core/auth/auth.facade';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-patients-page',
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

  isDeleting = signal(false);
  searchText = new Subject<string>();
  filters: PatientFilterDto = {};
  permession = PERMISSIONS;

  private facade = inject(PatientsFacade);
  patients = this.facade.patients;

  ngOnInit() {
    this.facade.loadPatients();
  }

  onSearch(term: string) {
    this.facade.search(term);
  }

  onDeletePatient(patient: Patient) {
    if (this.auth.hasPermission(PERMISSIONS.PATIENTS.DELETE)) {
      this.facade.deletePatient(patient);
    } else {
      this.toast.warning('لا تملك صلاحية الوصول لتنفيذ  هذه العملية');
    }
  }

  onAddPatient() {
    this.navReception.goToPatientsAdd();
  }
}
