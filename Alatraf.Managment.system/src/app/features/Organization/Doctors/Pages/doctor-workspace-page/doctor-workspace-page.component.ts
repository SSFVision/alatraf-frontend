import { finalize } from 'rxjs';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DoctorFacade } from '../../Service/doctor.facade.service';
import { CommonModule } from '@angular/common';
import { AddEditDoctorFormComponent } from '../../Components/add-edit-doctor-form/add-edit-doctor-form.component';
import { DepartmentsFacade } from '../../../Departments/departments.facade.service';
import { CreateDoctorRequest } from '../../Models/create-doctor.request';
import { UpdateDoctorRequest } from '../../Models/update-doctor.request';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-doctor-workspace-page',
  standalone: true,
  imports: [CommonModule, AddEditDoctorFormComponent],
  templateUrl: './doctor-workspace-page.component.html',
  styleUrl: './doctor-workspace-page.component.css',
})
export class DoctorWorkspacePageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  doctorFacade = inject(DoctorFacade);
  departmentsFacade = inject(DepartmentsFacade);
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
}
