import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { PatientsListComponent } from '../../components/patients.list/patients.list.component';
import {
  Patient,
  PatientFilterDto,
  PatientType,
} from '../../models/patient.model';
import { PatientService } from '../../Services/patient.service';
import { ApiResult } from '../../../../../core/models/ApiResult';
import { FormsModule } from '@angular/forms';
import { DialogService } from '../../../../../shared/components/dialog/dialog.service';
import {
  DialogConfig,
} from '../../../../../shared/components/dialog/DialogConfig';
import { debounceTime, filter, finalize, Subject, switchMap } from 'rxjs';
import { ToastService } from '../../../../../core/services/toast.service';
import { NavigationReceptionFacade } from '../../../../../core/navigation/navigation-reception.facade';
import { PatientsFacade } from '../../Services/patients.facade.service';

@Component({
  selector: 'app-patients-page',
  imports: [PatientsListComponent, RouterOutlet, FormsModule],
  templateUrl: './patients.page.component.html',
  styleUrl: './patients.page.component.css',
})
export class PatientsPageComponent implements OnInit {
  private patientService = inject(PatientService);
  private dialogService = inject(DialogService);
  private toast = inject(ToastService);
  private navReception = inject(NavigationReceptionFacade);
  isDeleting = signal(false);
  // patients = signal<Patient[]>([]);
  searchText = new Subject<string>();
  filters: PatientFilterDto = {};

  private facade = inject(PatientsFacade);
    patients = this.facade.patients;

  ngOnInit() {
  this.facade.loadPatients();
  
  }

  onSearch(term: string) {
    this.facade.search(term);
  }


  onDeletePatient(patient: Patient) {
   this.facade.deletePatient(patient);
  }

  onAddPatient() {
  this.navReception.goToPatientsAdd();
}

}

// From facade version


// import { PatientsFacade } from './../../Services/patients.facade.service';
// import { Component, OnInit, inject } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { PatientsListComponent } from '../../components/patients.list/patients.list.component';

// import { Patient, PatientFilterDto } from '../../models/patient.model';
// import { DialogService } from '../../../../../shared/components/dialog/dialog.service';
// import { DialogConfig } from '../../../../../shared/components/dialog/DialogConfig';
// import { NavigationReceptionFacade } from '../../../../../core/navigation/navigation-reception.facade';
// import { FormsModule } from '@angular/forms';


// @Component({
//   selector: 'app-patients-page',
//   imports: [PatientsListComponent, RouterOutlet, FormsModule],
//   templateUrl: './patients.page.component.html',
//   styleUrl: './patients.page.component.css',
// })
// export class PatientsPageComponent implements OnInit {

//   private facade = inject(PatientsFacade);
//   private dialogService = inject(DialogService);
//   private navReception = inject(NavigationReceptionFacade);

//   patients = this.facade.patients;
//   filters = this.facade.filters;
//   isDeleting = this.facade.isDeleting;
//   isLoading = this.facade.isLoadingList;

//   ngOnInit() {
//     this.facade.loadPatients();
//   }

//   onSearch(term: string) {
//     this.facade.search(term);
//   }

//   onFilterChange(filter: Partial<PatientFilterDto>) {
//     this.facade.setFilters(filter);
//   }

//   onDeletePatient(patient: Patient) {
//     const config: DialogConfig = {
//       title: 'حذف بيانات المريض',
//       message: 'هل أنت متأكد من حذف بيانات المريض التالية؟',
//       payload: {
//         'رقم المريض': patient.nationalNo,
//         الاسم: patient.fullname,
//       },
//     };

//     this.dialogService.confirmDelete(config).subscribe((confirmed) => {
//       if (!confirmed) return;

//       this.facade.deletePatient(patient).subscribe();
//     });
//   }

//   onAddPatient() {
//     this.navReception.goToPatientsAdd();
//   }
// }
