import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { ToastService } from '../../../../../core/services/toast.service';
import { DepartmentsFacade } from '../../../Departments/departments.facade.service';
import { AddEditDoctorFormComponent } from '../../Components/add-edit-doctor-form/add-edit-doctor-form.component';
import { CreateDoctorRequest } from '../../Models/create-doctor.request';
import { DoctorDto } from '../../Models/doctor.dto';
import { UpdateDoctorRequest } from '../../Models/update-doctor.request';
import { DoctorFacade } from '../../Service/doctor.facade.service';
import { AssignDoctorSectionComponent } from "../assign-doctor-section/assign-doctor-section.component";

@Component({
  selector: 'app-doctor-workspace-page',
  standalone: true,
  imports: [CommonModule, AddEditDoctorFormComponent, AssignDoctorSectionComponent],
  templateUrl: './doctor-workspace-page.component.html',
  styleUrl: './doctor-workspace-page.component.css',
})
export class DoctorWorkspacePageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  doctorFacade = inject(DoctorFacade);
  loadingSelectedDoctor = this.doctorFacade.LoadingselectedDoctor;
  departmentsFacade = inject(DepartmentsFacade);
  private toastService = inject(ToastService);
  isAssignPage = signal(false);
  isSaving = signal(false);
  ngOnInit(): void {
    this.lisonToRouteParamsChange();
    this.departmentsFacade.loadDepartments();
  }

  private lisonToRouteParamsChange(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('doctorId');

      if (id !== null && id !== undefined) {
        this.doctorFacade.loadDoctorForEdit(+id);
      } else {
        this.doctorFacade.enterCreateMode();
      }
    });
  }

  onSave(payload: CreateDoctorRequest | UpdateDoctorRequest): void {
    this.isSaving.set(true);
    if (this.doctorFacade.isEditMode()) {
      const doctorId = this.doctorFacade.selectedDoctor()?.doctorId;
      if (doctorId) {
        console.log('updated request payload:', payload);

        this.doctorFacade
          .updateDoctor(doctorId, payload)
          .pipe(finalize(() => this.isSaving.set(false)))
          .subscribe
          //   (res) => {
          //   if (res.success && res.data) {
          //     this.isSaving.set(false);
          //   }
          // }
          ();
      }
    } else {
      console.log('Created request payload:', payload);
      this.doctorFacade
        .createDoctor(payload)
        .pipe(finalize(() => this.isSaving.set(false)))
        .subscribe
        //   (res) => {
        //   if (res.success && res.data) {
        //     this.isSaving.set(false);
        //   }
        // }
        ();
    }
  }
  onDeleteDoctor(doctor: DoctorDto) {
    this.toastService.warning('حذف الطبيب غير مفعّل حالياً.');
    // this.doctorFacade.deleteDoctor(doctor);
  }

  switchToAssign() {
    this.isAssignPage.set(true);
  }
  switchToEdit(){
    this.isAssignPage.set(false);
  }
}
