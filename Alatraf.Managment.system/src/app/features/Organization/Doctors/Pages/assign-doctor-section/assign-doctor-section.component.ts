import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize, Subject, takeUntil } from 'rxjs';

import { DoctorDto } from '../../Models/doctor.dto';
import { Department } from '../../../../Diagnosis/Shared/enums/department.enum';
import { DepartmentSectionDto } from '../../../Models/department-section.dto';
import { SectionRoomDto } from '../../../Models/section-room.dto';
import { OrganizationService } from '../../../organization.service';
import { AssignDoctorToSectionRoomRequest } from '../../Models/assign-doctor-to-section-room.request';
import { DoctorFacade } from '../../Service/doctor.facade.service';

@Component({
  selector: 'app-assign-doctor-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './assign-doctor-section.component.html',
  styleUrl: './assign-doctor-section.component.css',
})
export class AssignDoctorSectionComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private organizationService = inject(OrganizationService);
  private doctorFacade = inject(DoctorFacade);

  selectedDoctor = input<DoctorDto | null>(null);

  sections = signal<DepartmentSectionDto[]>([]);
  rooms = signal<SectionRoomDto[]>([]);

  loadingSections = signal<boolean>(false);
  loadingRooms = signal<boolean>(false);

  isTherapyDoctor = signal<boolean>(false);
  isSubmitting = signal<boolean>(false); // ADDED: For submission state
  isSaved = signal<boolean>(false);
  isEditMode = computed(
    () => !!this.selectedDoctor()?.sectionId || this.isSaved()
  );

  form!: FormGroup;
  private destroy$ = new Subject<void>();

  // constructor() {
  //   this.setupReactiveEffects();
  // }

  ngOnInit(): void {
    this.initForm();
    this.handleDoctorChange();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // REPLACE your entire onSectionChange method with this new version
  onSectionChange(): void {
    const sectionId = this.form.controls['sectionId'].value;
    const roomControl = this.form.controls['roomId'];

    // Always reset and disable the room control when the section changes
    roomControl.reset(null);
    roomControl.disable();
    this.rooms.set([]);

    // Only if conditions are met, ENABLE the control and load data
    if (sectionId && this.isTherapyDoctor()) {
      roomControl.enable();
      this.loadRoomsForSection(sectionId);
    }
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    console.log(' Submitting form with values:', this.form.value);

    const doctor = this.selectedDoctor();
    if (!doctor || !doctor.doctorId) {
      console.error('Cannot submit: Doctor information is missing.');
      return;
    }

    this.isSubmitting.set(true);

    const request: AssignDoctorToSectionRoomRequest = {
      sectionId: this.form.value.sectionId,
      roomId: this.form.value.roomId,
      isActive: this.form.value.isActive,
      notes: this.form.value.notes,
    };

    this.doctorFacade
      .assignDoctorToSectionRoom(doctor.doctorId, request)
      .pipe(
        finalize(() => this.isSubmitting.set(false)),
        takeUntil(this.destroy$)
      )
      .subscribe((result) => {
        if (result.success) {
          this.isSaved.set(true);
          this.form.markAsPristine();
        }
      });
  }
  private initForm(): void {
    this.form = this.fb.group({
      sectionId: [null, [Validators.required]],
      roomId: [{ value: null, disabled: true }],
      isActive: [true, [Validators.required]],
      notes: [''],
    });
  }

  private setupReactiveEffects(): void {
    effect(() => {
      this.handleDoctorChange();
    });
  }

  private handleDoctorChange(): void {
    const doctor = this.selectedDoctor();
    this.sections.set([]);
    this.rooms.set([]);
    this.form.reset({ isActive: doctor?.isActive ?? true });
    this.clearRoomValidators();
    this.form.controls['roomId'].disable();

    if (!doctor || !doctor.departmentId) {
      this.isTherapyDoctor.set(false);
      return;
    }

    this.loadingSections.set(true);

    if (doctor.departmentId === Department.Therapy) {
      this.isTherapyDoctor.set(true);
      this.addRoomValidators();
      // Pass the doctor object to the loading methods
      this.loadTherapySections(doctor);
    } else if (doctor.departmentId === Department.Industrial) {
      this.isTherapyDoctor.set(false);
      this.loadIndustrialSections(doctor);
    } else {
      this.isTherapyDoctor.set(false);
      this.loadingSections.set(false);
    }
  }

  private loadTherapySections(doctor: DoctorDto): void {
    this.organizationService
      .getSectionsByDepartmentId(Department.Therapy)
      .pipe(
        finalize(() => this.loadingSections.set(false)),
        takeUntil(this.destroy$)
      )
      .subscribe((res) => {
        this.sections.set(res.data ?? []);
        if (doctor.sectionId) {
          this.form.patchValue({ sectionId: doctor.sectionId });
          this.loadRoomsForSection(doctor.sectionId, doctor.roomId);
        }
      });
  }

  private loadIndustrialSections(doctor: DoctorDto): void {
    this.organizationService
      .getSectionsByDepartmentId(Department.Industrial)
      .pipe(
        finalize(() => this.loadingSections.set(false)),
        takeUntil(this.destroy$)
      )
      .subscribe((res) => {
        this.sections.set(res.data ?? []);
        if (doctor.sectionId) {
          this.form.patchValue({ sectionId: doctor.sectionId });
          this.form.markAsPristine(); // ADD THIS LINE
        }
      });
  }

  private loadRoomsForSection(
    sectionId: number,
    roomIdToSelect?: number | null
  ): void {
    const roomControl = this.form.controls['roomId'];
    this.loadingRooms.set(true);
    roomControl.disable(); // Keep it disabled while loading

    this.organizationService
      .getRoomsBySectionId(sectionId)
      .pipe(
        finalize(() => {
          this.loadingRooms.set(false);
          roomControl.enable(); // Enable it after loading is complete
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((res) => {
        this.rooms.set(res.data ?? []);
        if (roomIdToSelect) {
          this.form.patchValue({ roomId: roomIdToSelect });
          this.form.markAsPristine();
        }
      });
  }

  private addRoomValidators(): void {
    // this.form.controls['roomId'].setValidators([Validators.required]);
    this.form.controls['roomId'].updateValueAndValidity();
  }

  private clearRoomValidators(): void {
    this.form.controls['roomId'].clearValidators();
    this.form.controls['roomId'].updateValueAndValidity();
  }
}
