import { Component, DestroyRef, inject, signal } from '@angular/core';
import { HeaderPatientInfoComponent } from '../../../Shared/Components/header-patient-info/header-patient-info.component';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../../../../Reception/Patients/Services/patient.service';
import { Patient } from '../../../../Reception/Patients/models/patient.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AddIndustrialDiagnosisFormComponent } from '../../Components/add-industrial-diagnosis-form/add-industrial-diagnosis-form.component';
import { PreviousIndustrialDiagnosisComponent } from "../../Components/previous-industrial-diagnosis/previous-industrial-diagnosis.component";
import { MOCK_INDUSTRIAL_DIAGNOSIS_HISTORY, IndustrialDiagnosisHistoryDto } from '../../Models/industrial-diagnosis-history.dto';

@Component({
  selector: 'app-industrial-diagnosis-workspace',
  imports: [HeaderPatientInfoComponent, AddIndustrialDiagnosisFormComponent, PreviousIndustrialDiagnosisComponent],
  templateUrl: './industrial-diagnosis-workspace.component.html',
  styleUrl: './industrial-diagnosis-workspace.component.css',
})
export class IndustrialDiagnosisWorkspaceComponent {
  isLoading = signal(true);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private patientService = inject(PatientService);

  patient = signal<Patient | null>(null);
  viewMode = signal<'add' | 'history'>('add');
  ngOnInit(): void {
    this.listenToRouteChanges();
  }
  onSubmitDiagnosis(formValue: any) {
    console.log('Final Diagnosis Payload:', formValue);
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

// for previous disgnosis
industrialHistoryItems = MOCK_INDUSTRIAL_DIAGNOSIS_HISTORY;

openHistoryDetails(item: IndustrialDiagnosisHistoryDto) {
  console.log("View details:", item);
}



}
