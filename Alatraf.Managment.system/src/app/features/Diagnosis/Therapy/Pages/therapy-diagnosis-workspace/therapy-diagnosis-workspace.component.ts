import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../../../../Reception/Patients/Services/patient.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HeaderPatientInfoComponent } from '../../../Shared/Components/header-patient-info/header-patient-info.component';
import { MOCK_THERAPY_CARD_HISTORY, TherapyCardHistoryDto } from '../../Models/therapy-card-history.dto';
import { PreviousTherapyCardDiagnosisComponent } from '../../Components/previous-therapy-card-diagnosis/previous-therapy-card-diagnosis.component';
import { AddTherapyDiagnosisFormComponent } from '../../Components/add-therapy-diagnosis-form/add-therapy-diagnosis-form.component';
import { ToastService } from '../../../../../core/services/toast.service';
import { CreateTherapyCardRequest } from '../../Models/create-therapy-card.request';
import { PatientDto } from '../../../../../core/models/Shared/patient.model';

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
  patient = signal<PatientDto | null>(null);
  viewMode = signal<'add' | 'history'>('add');

  isLoading = signal(true);

 

  ngOnInit(): void {
    this.listenToRouteChanges();
  }

 
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

  saveTherapyDiagnosis(formValue: CreateTherapyCardRequest) {

    this.toast.success("Saved Sucess"+formValue.DiagnosisText)
    console.log('Therapy Diagnosis Payload:', formValue);
  }
}
