import { CommonModule, NgFor } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { HeaderPatientInfoComponent } from '../../../../shared/components/header-patient-info/header-patient-info.component';

import { Department } from '../../../Diagnosis/Shared/enums/department.enum';
import { DepartmentSectionDto } from '../../../Organization/Models/department-section.dto';

import {
  PatientDto,
  PatientType,
} from '../../../../core/models/Shared/patient.model';
import { GetDoctorDto } from '../../../Organization/Models/get-doctor.dto';
import { OrganizationService } from '../../../Organization/organization.service';
import { AssignIndustrialPartsRequest } from '../../Models/assign-industrial-parts.request';
import { RepairCardsFacade } from '../../Services/repair-cards.facade.service';
import { CreateDeliveryDateComponent } from '../create-delivery-date/create-delivery-date.component';

@Component({
  selector: 'app-repair-card-assignments-workspace',
  standalone: true,
  imports: [
    CommonModule,
    NgFor,
    ReactiveFormsModule,
    HeaderPatientInfoComponent,
    CreateDeliveryDateComponent,
    
  ],
  templateUrl: './repair-card-assignments-workspace.component.html',
  styleUrl: './repair-card-assignments-workspace.component.css',
})
export class RepairCardAssignmentsWorkspaceComponent {
  // ------------------------------------------------------------------
  // Injected services
  // ------------------------------------------------------------------
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  private repairFacade = inject(RepairCardsFacade);
  private organizationService = inject(OrganizationService);

  // ------------------------------------------------------------------
  // Facade state
  // ------------------------------------------------------------------
  repairCard = this.repairFacade.repairCard;
  loadingRepairCard = this.repairFacade.loadingRepairCard;

  assigningIndustrialParts = this.repairFacade.assigningIndustrialParts;
  industrialPartsAssigned = this.repairFacade.industrialPartsAssigned;
  formValidationErrors = this.repairFacade.formValidationErrors;

  // ------------------------------------------------------------------
  // Local state
  // ------------------------------------------------------------------
  private repairCardId!: number;

  // ------------------------------------------------------------------
  // Form
  // ------------------------------------------------------------------
  assignForm!: FormGroup;

  get assignmentsArray(): FormArray {
    return this.assignForm.get('assignments') as FormArray;
  }

  // ------------------------------------------------------------------
  // Lifecycle
  // ------------------------------------------------------------------
  ngOnInit(): void {
    this.initForm();
    this.listenToRouteChanges();
  }

  private listenToRouteChanges(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const repairCardId = Number(params.get('repairCardId'));

        if (!repairCardId || Number.isNaN(repairCardId)) {
          return;
        }

        // reset UI + facade state
        this.assignForm.reset();
        this.assignmentsArray.clear();

        this.repairCardId = repairCardId;

        this.repairFacade.loadRepairCardById(repairCardId).subscribe({
          next: () => {
            this.buildAssignmentsFromIndustrialParts();
            this.loadIndustrialSections();
          },
        });
      });
  }

  // ------------------------------------------------------------------
  // Patient mapping for header
  // ------------------------------------------------------------------
  patient = computed<PatientDto | null>(() => {
    const card = this.repairCard();
    if (!card) return null;

    return {
      patientId: card.patientId,
      personId: card.patientId,
      patientType: PatientType.Normal,
      personDto: {
        personId: card.patientId,
        fullname: card.patientName,
        gender: card.gender,
        birthdate: undefined,
        phone: undefined,
        address: undefined,
        addressId: undefined,
        nationalNo: undefined,
        autoRegistrationNumber: undefined,
      },
    };
  });

  // ------------------------------------------------------------------
  // Form initialization
  // ------------------------------------------------------------------
  private initForm(): void {
    this.assignForm = this.fb.group({
      assignments: this.fb.array([]),
    });
  }

  // ------------------------------------------------------------------
  // Build FormArray from DiagnosisIndustrialParts
  // ------------------------------------------------------------------
  private buildAssignmentsFromIndustrialParts(): void {
    const card = this.repairCard();

    if (!card?.diagnosisIndustrialParts?.length) {
      return;
    }

    this.assignmentsArray.clear();

    card.diagnosisIndustrialParts.forEach((part) => {
      this.assignmentsArray.push(
        this.fb.group({
          diagnosisIndustrialPartId: [
            part.diagnosisIndustrialPartId,
            Validators.required,
          ],
          sectionId: [null, Validators.required],
          doctorId: [null, Validators.required],
        })
      );
    });
  }

  // ------------------------------------------------------------------
  // Sections & Doctors
  // ------------------------------------------------------------------
  sections = signal<DepartmentSectionDto[]>([]);
  loadingSections = signal<boolean>(false);

  private loadIndustrialSections(): void {
    this.loadingSections.set(true);

    this.organizationService
      .getSectionsByDepartmentId(Department.Industrial)
      .subscribe((res) => {
        if (res.isSuccess && res.data) {
          this.sections.set(res.isSuccess && res.data ? res.data : []);
          this.loadingSections.set(false);
        } else {
          this.sections.set([]);
          this.loadingSections.set(false);
        }
      });
  }

  doctorsByRowIndex = signal<Record<number, GetDoctorDto[]>>({});
  loadingDoctorsByRow = signal<Record<number, boolean>>({});

  onSectionChange(rowIndex: number): void {
    const group = this.assignmentsArray.at(rowIndex) as FormGroup;
    const sectionId = group.get('sectionId')?.value;

    if (!sectionId) {
      return;
    }

    // reset dependent field
    group.patchValue({ doctorId: null });

    // set loading for this row
    this.loadingDoctorsByRow.update((state) => ({
      ...state,
      [rowIndex]: true,
    }));

    this.organizationService.getDoctorsBySection(sectionId).subscribe((res) => {
      if (res.isSuccess && res.data) {
        this.doctorsByRowIndex.update((state) => ({
          ...state,
          [rowIndex]: res.isSuccess && res.data ? res.data : [],
        }));
      } else {
        this.doctorsByRowIndex.update((state) => ({
          ...state,
          [rowIndex]: [],
        }));
      }

      this.loadingDoctorsByRow.update((state) => ({
        ...state,
        [rowIndex]: false,
      }));
    });
  }

  getDoctorsForRow(rowIndex: number): any[] {
    return this.doctorsByRowIndex()[rowIndex] ?? [];
  }

  // ------------------------------------------------------------------
  // Submit Assign Industrial Parts
  // ------------------------------------------------------------------

  makeCardDeliveryTime = signal<boolean>(false);

  submit(): void {
    if (this.assignForm.invalid) {
      this.assignForm.markAllAsTouched();
      return;
    }

    const request: AssignIndustrialPartsRequest = {
      assignments: this.assignForm.value.assignments,
    };
    console.log('assign-industrial-parts:', request);
    this.repairFacade
      .assignIndustrialParts(this.repairCardId, request)
      .subscribe((res) => {
        if (res.success) {
          this.makeCardDeliveryTime.set(true);
          this.assignForm.disable();
        }
      });
  }

  openDeliveryDateDialog = signal<boolean>(false);
  onCardDeliveryTimeClick() {
    this.openDeliveryDateDialog.set(true);
  }

  onCloseDeliveryDateDialog() {
    this.openDeliveryDateDialog.set(false);
  }
}
