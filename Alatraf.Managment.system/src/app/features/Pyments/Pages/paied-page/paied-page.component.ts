import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';
import { Patient } from '../../../../mocks/patients/patient.dto';
import { MOCK_THERAPY_CARD_HISTORY, TherapyCardHistoryDto } from '../../../Diagnosis/Therapy/Models/therapy-card-history.dto';
import { TherapyDiagnosisFormDto } from '../../../Diagnosis/Therapy/Models/therapy-diagnosis-form.dto';
import { PatientService } from '../../../Reception/Patients/Services/patient.service';
import { AddTherapyDiagnosisFormComponent } from "../../../Diagnosis/Therapy/Components/add-therapy-diagnosis-form/add-therapy-diagnosis-form.component";
import { HeaderPatientInfoComponent } from "../../../Diagnosis/Shared/Components/header-patient-info/header-patient-info.component";
import { PreviousTherapyCardDiagnosisComponent } from "../../../Diagnosis/Therapy/Components/previous-therapy-card-diagnosis/previous-therapy-card-diagnosis.component";

@Component({
  selector: 'app-paied-page',
  imports: [AddTherapyDiagnosisFormComponent, HeaderPatientInfoComponent, PreviousTherapyCardDiagnosisComponent],
  templateUrl: './paied-page.component.html',
  styleUrl: './paied-page.component.css'
})
export class PaiedPageComponent {
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
