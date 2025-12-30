import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { HeaderPatientInfoComponent } from '../../../../shared/components/header-patient-info/header-patient-info.component';
import { PreviousTherapySessionsHistoryComponent } from '../../Components/previous-therapy-sessions-history/previous-therapy-sessions-history.component';

import { TherapySessionsFacade } from '../../services/therapy-sessions.facade.service';

import { CommonModule, NgFor } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  PatientDto,
  PatientType,
} from '../../../../core/models/Shared/patient.model';
import { Department } from '../../../Diagnosis/Shared/enums/department.enum';
import { DiagnosisProgramDto } from '../../../Diagnosis/Therapy/Models/therapy-card-diagnosis.dto';
import { DepartmentSectionDto } from '../../../Organization/Models/department-section.dto';
import { OrganizationService } from '../../../Organization/organization.service';

@Component({
  selector: 'app-sessions-mangment',
  standalone: true,
  imports: [
    NgFor,
    CommonModule,
    ReactiveFormsModule,
    HeaderPatientInfoComponent,
    PreviousTherapySessionsHistoryComponent,
  ],
  templateUrl: './sessions-mangment.component.html',
  styleUrl: './sessions-mangment.component.css',
})
export class SessionsManagementComponent implements OnInit {
  // ------------------------------------------------------------------
  // Injected services
  // ------------------------------------------------------------------
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private sessionsFacade = inject(TherapySessionsFacade);
  private therapyCardId!: number;
  private destroyRef = inject(DestroyRef);

  // ------------------------------------------------------------------
  // Facade state
  // ------------------------------------------------------------------
  therapyCard = this.sessionsFacade.therapyCard;
  loadingTherapyCard = this.sessionsFacade.loadingTherapyCard;
  programs = computed<DiagnosisProgramDto[]>(() => {
    return this.therapyCard()?.programs ?? [];
  });
  // ------------------------------------------------------------------
  // View state
  // ------------------------------------------------------------------
  viewMode = signal<'add' | 'history'>('add');
  sessions = this.sessionsFacade.sessions;
  sessionCreated = this.sessionsFacade.sessionCreated;
  creatingSession = this.sessionsFacade.creatingSession;
  therapyCardIdSignal = computed<number | null>(() => {
    return this.therapyCard()?.therapyCardId ?? null;
  });
  // canSubmit = signal(false);

  sessionForm!: FormGroup;
  constructor() {
    effect(() => {
      const mode = this.viewMode();
      const therapyCardId = this.therapyCardIdSignal();

      if (mode === 'history' && therapyCardId) {
        console.log('therapyCardIdSignal = ', this.therapyCardIdSignal());
        this.loadSessionsHistory(therapyCardId);
      }
    });
  }
  private loadSessionsHistory(therapyCardId: number): void {
    this.sessionsFacade.loadSessionsByTherapyCardId(therapyCardId).subscribe();
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
        const therapyCardId = Number(params.get('therapyCardId'));

        if (!therapyCardId || Number.isNaN(therapyCardId)) {
          return;
        }

        // reset component + facade state
        this.sessionForm.reset();
        this.sessionProgramsArray.clear();
        this.sessionsFacade.clearState();

        this.therapyCardId = therapyCardId;

        this.sessionsFacade
          .loadTherapyCardById(therapyCardId)
          .subscribe((res) => {
            if (res.isSuccess && res.data) {
              if (this.viewMode() === 'add') {
                this.buildFormArrayFromPrograms();
                this.loadTherapySections();
              }
            }
          });
      });
  }

  // ------------------------------------------------------------------
  // Patient mapping for header
  // ------------------------------------------------------------------
  patient = computed<PatientDto | null>(() => {
    const card = this.therapyCard();
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
        nationalNo: undefined,
        autoRegistrationNumber: undefined,
      },
    };
  });

  // ------------------------------------------------------------------
  // Form initialization
  // ------------------------------------------------------------------
  private initForm(): void {
    this.sessionForm = this.fb.group({
      sessionPrograms: this.fb.array([]),
    });
  }

  // ------------------------------------------------------------------
  // FormArray helpers
  // ------------------------------------------------------------------
  get sessionProgramsArray(): FormArray {
    return this.sessionForm.get('sessionPrograms') as FormArray;
  }

  getSessionProgramGroup(index: number): FormGroup {
    return this.sessionProgramsArray.at(index) as FormGroup;
  }

  // ------------------------------------------------------------------
  // Build FormArray from diagnosis programs
  // ------------------------------------------------------------------
  private buildFormArrayFromPrograms(): void {
    const card = this.therapyCard();

    if (!card || !card.programs || card.programs.length === 0) {
      return;
    }

    // safety
    this.sessionProgramsArray.clear();

    card.programs.forEach((program) => {
      this.sessionProgramsArray.push(this.createSessionProgramGroup(program));
    });
  }

  private createSessionProgramGroup(program: DiagnosisProgramDto): FormGroup {
    return this.fb.group({
      diagnosisProgramId: [program.diagnosisProgramId, Validators.required],
      sectionId: [null, Validators.required],
      roomId: [null, Validators.required],
      doctorId: [null, Validators.required],
    });
  }

  switchToAdd(): void {
    this.viewMode.set('add');
  }

  switchToHistory(): void {
    this.viewMode.set('history');
  }

  onViewSessionDetails(sessionId: number): void {
    console.log('View session details:', sessionId);
  }


  submit(): void {
    if (this.sessionForm.invalid) {
      this.sessionForm.markAllAsTouched();
      return;
    }

    const request = {
      sessionPrograms: this.sessionForm.value.sessionPrograms,
    };

    this.sessionsFacade
      .createSession(this.therapyCardId, request)
      .subscribe((res) => {
        if (res.success) {
          this.sessionForm.disable(); // ✅ هنا السحر
          // this.canSubmit.set(true);
        }
      });
  }

  private organizationService = inject(OrganizationService);
  sections = signal<DepartmentSectionDto[]>([]);
  loadingSections = signal<boolean>(false);

  private loadTherapySections(): void {
    this.loadingSections.set(true);
    this.organizationService
      .getSectionsByDepartmentId(Department.Therapy)
      .subscribe({
        next: (res) => {
          if (res.isSuccess && res.data) {
            this.sections.set(res.data);
          } else {
            this.sections.set([]);
          }

          this.loadingSections.set(false);
        },
        error: () => {
          this.sections.set([]);
          this.loadingSections.set(false);
        },
      });
  }

  // rooms indexed by form row index
  roomsByRowIndex = signal<Record<number, any[]>>({});
  loadingRoomsByRow = signal<Record<number, boolean>>({});
  onSectionChange(rowIndex: number): void {
    const rowGroup = this.getSessionProgramGroup(rowIndex);
    const sectionId = rowGroup.get('sectionId')?.value;

    if (!sectionId) {
      return;
    }

    // reset dependent fields
    rowGroup.patchValue({
      roomId: null,
      doctorId: null,
    });

    // set loading for this row
    this.loadingRoomsByRow.update((state) => ({
      ...state,
      [rowIndex]: true,
    }));

    this.organizationService.getRoomsBySectionId(sectionId).subscribe({
      next: (res) => {
        this.roomsByRowIndex.update((state) => ({
          ...state,
          [rowIndex]: res.isSuccess && res.data ? res.data : [],
        }));

        this.loadingRoomsByRow.update((state) => ({
          ...state,
          [rowIndex]: false,
        }));
      },
      error: () => {
        this.roomsByRowIndex.update((state) => ({
          ...state,
          [rowIndex]: [],
        }));

        this.loadingRoomsByRow.update((state) => ({
          ...state,
          [rowIndex]: false,
        }));
      },
    });
  }

  getRoomsForRow(rowIndex: number): any[] {
    return this.roomsByRowIndex()[rowIndex] ?? [];
  }

  // doctors indexed by form row index
  doctorsByRowIndex = signal<Record<number, any[]>>({});
  loadingDoctorsByRow = signal<Record<number, boolean>>({});
  onRoomChange(rowIndex: number): void {
    const rowGroup = this.getSessionProgramGroup(rowIndex);

    const sectionId = rowGroup.get('sectionId')?.value;
    const roomId = rowGroup.get('roomId')?.value;

    if (!sectionId || !roomId) {
      return;
    }

    // reset dependent field
    rowGroup.patchValue({
      doctorId: null,
    });

    // set loading for this row
    this.loadingDoctorsByRow.update((state) => ({
      ...state,
      [rowIndex]: true,
    }));

    this.organizationService
      .getDoctorsBySectionAndRoomId(sectionId, roomId)
      .subscribe({
        next: (res) => {
          this.doctorsByRowIndex.update((state) => ({
            ...state,
            [rowIndex]: res.isSuccess && res.data ? res.data : [],
          }));

          this.loadingDoctorsByRow.update((state) => ({
            ...state,
            [rowIndex]: false,
          }));
        },
        error: () => {
          this.doctorsByRowIndex.update((state) => ({
            ...state,
            [rowIndex]: [],
          }));

          this.loadingDoctorsByRow.update((state) => ({
            ...state,
            [rowIndex]: false,
          }));
        },
      });
  }

  getDoctorsForRow(rowIndex: number): any[] {
    return this.doctorsByRowIndex()[rowIndex] ?? [];
  }
}
