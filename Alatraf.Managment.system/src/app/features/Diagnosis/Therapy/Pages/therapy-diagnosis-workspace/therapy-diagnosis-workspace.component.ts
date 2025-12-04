import { DiagnosisDepartments } from './../../../../../mocks/Tickets/ticket.model';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SelectTherapyProgramsComponent } from '../../Components/select-therapy-programs/select-therapy-programs.component';
import { CreateTherapyCardMedicalProgramRequest, CreateTherapyCardRequest } from '../../Models/create-therapy-card.request';
import { ActivatedRoute } from '@angular/router';
import { Patient } from '../../../../../mocks/patients/patient.dto';
import { PatientService } from '../../../../Reception/Patients/Services/patient.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HeaderPatientInfoComponent } from "../../../Shared/Components/header-patient-info/header-patient-info.component";
import { TherapyCardHistoryDto } from '../../Models/therapy-card-history.dto';
import { PreviousTherapyCardDiagnosisComponent } from "../../Components/previous-therapy-card-diagnosis/previous-therapy-card-diagnosis.component";

@Component({
  selector: 'app-therapy-diagnosis-workspace',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SelectTherapyProgramsComponent,
    HeaderPatientInfoComponent,
    PreviousTherapyCardDiagnosisComponent
],
  templateUrl: './therapy-diagnosis-workspace.component.html',
  styleUrls: ['./therapy-diagnosis-workspace.component.css'],
})

export class TherapyDiagnosisWorkspaceComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private patientService = inject(PatientService);

  
  patient = signal<Patient | null>(null);
  viewMode = signal<'add' | 'history'>('add');

  form: FormGroup = this.buildForm();

  private buildForm(): FormGroup {
    return this.fb.group({
      InjurySides: this.fb.control([], Validators.required),
      InjuryTypes: this.fb.control([], Validators.required),
      InjuryDate: this.fb.control(null, Validators.required),
      InjuryReasons: this.fb.control([], Validators.required),
      DiagnosisText: this.fb.control('', Validators.required),

      ProgramStartDate: this.fb.control('', Validators.required),
      ProgramEndDate: this.fb.control('', Validators.required),

      TherapyCardType: this.fb.control(null, Validators.required),
      Notes: this.fb.control(''),

      Programs: this.fb.array<FormGroup>([]),
    });
  }
isLoading = signal(true);

  get programs(): FormArray<FormGroup> {
    return this.form.get('Programs') as FormArray<FormGroup>;
  }

  private createProgram(): FormGroup {
    return this.fb.group({
      MedicalProgramId: this.fb.control(null, Validators.required),
      Duration: this.fb.control(null, [Validators.required, Validators.min(1)]),
      Notes: this.fb.control(''),
    });
  }

  private ensureInitialRow(): void {
    if (this.programs.length === 0) {
      this.programs.push(this.createProgram());
    }
  }

  // ------------------
  // LIFECYCLE
  // ------------------
  ngOnInit(): void {
    this.listenToRouteChanges();
  }

  // ------------------
  // ROUTE PARAM CHANGE HANDLER
  // ------------------
private listenToRouteChanges() {
  this.route.paramMap
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((params) => {
      const idParam = params.get('patientId');
      const id = idParam ? Number(idParam) : NaN;

      if (!id || Number.isNaN(id)) {
        this.patient.set(null);
        this.isLoading.set(false);
        return;
      }

      // Reset UI
      this.isLoading.set(true);
      this.resetFormForNewPatient();

      this.patientService.getPatientById(id).subscribe((res) => {
        if (res.isSuccess && res.data) {
          this.patient.set(res.data);
        } else {
          this.patient.set(null);
        }

        this.isLoading.set(false); // ⬅ important
      });
    });
}

  medicalPrograms = [
    { id: 1, name: 'تدليك' },
    { id: 2, name: 'كهرباء' },
    { id: 3, name: 'wa' },
  ];
  private resetFormForNewPatient() {
    this.form = this.buildForm(); // Recreate form from scratch
    this.programs.clear();        // Clear FormArray
    this.ensureInitialRow();      // Add initial empty program row
  }


  switchToAdd() {
    this.viewMode.set('add');
  }

  switchToHistory() {
    this.viewMode.set('history');
  }


  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.error('❌ Form invalid:', this.form);
      return;
    }

    const formValue = this.form.value;

    const payload: CreateTherapyCardRequest = {
      TicketId: 0,
      DiagnosisText: formValue.DiagnosisText,
      InjuryDate: formValue.InjuryDate,
      InjuryReasons: formValue.InjuryReasons,
      InjurySides: formValue.InjurySides,
      InjuryTypes: formValue.InjuryTypes,
      PatientId: 0, // You will fill this later
      ProgramStartDate: formValue.ProgramStartDate,
      ProgramEndDate: formValue.ProgramEndDate,
      TherapyCardType: formValue.TherapyCardType,
      Notes: formValue.Notes ?? null,
      Programs: formValue.Programs as CreateTherapyCardMedicalProgramRequest[],
    };

    console.log('🔥 FINAL DIAGNOSIS PAYLOAD:', payload);
  }

// for previous Diagnosis


  MOCK_THERAPY_CARD_HISTORY: TherapyCardHistoryDto[] = [
  {
    therapyCardId: 1,
    cardNumber: '784512369',
    cardDate: '2023-02-05',

    diagnosisSummary: 'تمزق عضلي في الكتف الأيمن',
    departmentName: 'العلاج الطبيعي',
    status: 'completed',
    startDate: '2023-02-05',
    endDate: '2023-03-01',
    createdBy: 'د. محمد بن يوسف',
    notes: 'استجابة جيدة للعلاج',

    programs: [
      { programName: 'تدليك', totalSessions: 3 },
      { programName: 'كهرباء', totalSessions: 2 },
    ],
  },

  {
    therapyCardId: 2,
    cardNumber: '995412887',
    cardDate: '2023-03-18',

    diagnosisSummary: 'إلتهاب أوتار الرسغ',
    departmentName: 'العلاج الطبيعي',
    status: 'active',
    startDate: '2023-03-18',
    createdBy: 'أ. علي المصراتي',

    programs: [
      { programName: 'تمارين علاجية', totalSessions: 5 },
      { programName: 'تدليك' },
    ],
  },

  {
    therapyCardId: 3,
    cardNumber: '773641920',
    cardDate: '2023-05-10',

    diagnosisSummary: 'إصابة أعصاب الأطراف السفلية',
    departmentName: 'الأعصاب',
    status: 'stopped',
    startDate: '2023-05-10',
    endDate: '2023-05-20',
    createdBy: 'د. سامي البوعيشي',
    notes: 'تم إيقاف الجلسات بطلب من المريض',

    programs: [
      { programName: 'تحفيز كهربائي', totalSessions: 4 },
    ],
  },

  {
    therapyCardId: 4,
    cardNumber: '661239874',
    cardDate: '2023-06-01',

    diagnosisSummary: 'بتر أسفل الركبة – تجهيز طرف صناعي',
    departmentName: 'الأطراف الصناعية',
    status: 'active',
    startDate: '2023-06-01',
    createdBy: 'م. عبدالسلام خليفة',

    programs: [
      { programName: 'قياس وصب الطبعة' },
      { programName: 'تركيب أولي للطرف' },
    ],
  },
];

onViewHistoryCard(card: TherapyCardHistoryDto) {
  console.log('View history card details:', card);
  // later: open dialog, navigate to details, etc.
}


}
