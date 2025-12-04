import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Patient } from '../../../../../mocks/patients/patient.dto';
import { PatientService } from '../../../../Reception/Patients/Services/patient.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HeaderPatientInfoComponent } from '../../../Shared/Components/header-patient-info/header-patient-info.component';
import { MOCK_THERAPY_CARD_HISTORY, TherapyCardHistoryDto } from '../../Models/therapy-card-history.dto';
import { PreviousTherapyCardDiagnosisComponent } from '../../Components/previous-therapy-card-diagnosis/previous-therapy-card-diagnosis.component';
import { TherapyDiagnosisFormDto } from '../../Models/therapy-diagnosis-form.dto';
import { AddTherapyDiagnosisFormComponent } from '../../Components/add-therapy-diagnosis-form/add-therapy-diagnosis-form.component';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-therapy-diagnosis-workspace',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HeaderPatientInfoComponent,
    PreviousTherapyCardDiagnosisComponent,
    AddTherapyDiagnosisFormComponent,
  ],
  templateUrl: './therapy-diagnosis-workspace.component.html',
  styleUrls: ['./therapy-diagnosis-workspace.component.css'],
})
export class TherapyDiagnosisWorkspaceComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private patientService = inject(PatientService);


  private toast=inject(ToastService);
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

  pevDiagnosis= MOCK_THERAPY_CARD_HISTORY;
  onViewHistoryCard(card: TherapyCardHistoryDto) {
    console.log('View history card details:', card);
    // later: open dialog, navigate to details, etc.
  }

  // for the form

  saveTherapyDiagnosis(formValue: TherapyDiagnosisFormDto) {

    this.toast.success("Saved Sucess"+formValue.diagnosis)
    console.log('Therapy Diagnosis Payload:', formValue);
  }
}
