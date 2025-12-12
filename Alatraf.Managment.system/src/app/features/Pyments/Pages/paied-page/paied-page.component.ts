import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';
import { PatientService } from '../../../Reception/Patients/Services/patient.service';
import { HeaderPatientInfoComponent } from '../../../Diagnosis/Shared/Components/header-patient-info/header-patient-info.component';
import { PatientDto } from '../../../../core/models/Shared/patient.model';

@Component({
  selector: 'app-paied-page',
  imports: [HeaderPatientInfoComponent],
  templateUrl: './paied-page.component.html',
  styleUrl: './paied-page.component.css',
})
export class PaiedPageComponent {
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private patientService = inject(PatientService);

  private toast = inject(ToastService);
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

  OnPrint() {
    this.toast.warning('Print feature will be here sooon');
  }
  savePaied() {
    this.toast.info('payment feature will be here sooon');
  }
}
