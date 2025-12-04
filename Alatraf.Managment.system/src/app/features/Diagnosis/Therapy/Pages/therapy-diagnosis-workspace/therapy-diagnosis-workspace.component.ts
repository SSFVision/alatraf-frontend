import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Patient } from '../../../../../mocks/patients/patient.dto';
import { PatientService } from '../../../../Reception/Patients/Services/patient.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HeaderPatientInfoComponent } from "../../../Shared/Components/header-patient-info/header-patient-info.component";
import { TherapyCardHistoryDto } from '../../Models/therapy-card-history.dto';
import { PreviousTherapyCardDiagnosisComponent } from "../../Components/previous-therapy-card-diagnosis/previous-therapy-card-diagnosis.component";
import { TherapyDiagnosisFormDto } from '../../Models/therapy-diagnosis-form.dto';
import { AddTherapyDiagnosisFormComponent } from "../../Components/add-therapy-diagnosis-form/add-therapy-diagnosis-form.component";

@Component({
  selector: 'app-therapy-diagnosis-workspace',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HeaderPatientInfoComponent,
    PreviousTherapyCardDiagnosisComponent,
    AddTherapyDiagnosisFormComponent
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

 
isLoading = signal(true);

 
  private createProgram(): FormGroup {
    return this.fb.group({
      MedicalProgramId: this.fb.control(null, Validators.required),
      Duration: this.fb.control(null, [Validators.required, Validators.min(1)]),
      Notes: this.fb.control(''),
    });
  }

 

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

 
 

  switchToAdd() {
    this.viewMode.set('add');
  }

  switchToHistory() {
    this.viewMode.set('history');
  }

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

// for the form 

saveTherapyDiagnosis(formValue: TherapyDiagnosisFormDto) {
  console.log("Therapy Diagnosis Payload:", formValue);
}

}
