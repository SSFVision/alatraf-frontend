import {
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { DisabledCardsFacade } from '../../../Facades/disabled-cards.facade.service';
import { PatientsFacade } from '../../../../Reception/Patients/Services/patients.facade.service';

import { AddDisabledCardRequest } from '../../../models/disabled-Models/add-disabled-card.request';
import { DisabledCardDto } from '../../../models/disabled-Models/disabled-card.dto';
import { UpdateDisabledCardRequest } from '../../../models/disabled-Models/update-disabled-card.request';

import { DisabledCardFormComponent } from '../../../components/disabled-card-form/disabled-card-form.component';
import { PatientSummaryHeaderComponent } from '../../../../../shared/components/patient-summary-header/patient-summary-header.component';
import { PatientSummaryUiDto } from '../../../../../shared/models/patient-summary.ui-dto';
import { PatientDto } from '../../../../../core/models/Shared/patient.model';

type DisabledCardWorkspaceMode = 'create' | 'edit';

@Component({
  selector: 'app-disabled-card-workspace',
  standalone: true,
  imports: [DisabledCardFormComponent, PatientSummaryHeaderComponent],
  templateUrl: './disabled-card-workspace.component.html',
  styleUrl: './disabled-card-workspace.component.css',
})
export class DisabledCardWorkspaceComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private facade = inject(DisabledCardsFacade);
  private patientsFacade = inject(PatientsFacade);

  private routeSub?: Subscription;

  // ---------------------------------
  // STATE
  // ---------------------------------
  mode = signal<DisabledCardWorkspaceMode>('create');
  patientId = signal<number | null>(null);

  // ---------------------------------
  // FACADE SIGNALS
  // ---------------------------------
  card = this.facade.selectedDisabledCard;
  saving = this.facade.saving;
  loadingItem = this.facade.loadingItem;

  selectedPatient = this.patientsFacade.selectedPatient;
  loadingPatient = this.patientsFacade.loadingPatient;

  isLoading = computed(
    () => this.loadingItem() || this.saving() || this.loadingPatient()
  );

  canRenderForm = computed(() => {
    return this.mode() === 'edit' || !!this.patientId();
  });

  // ---------------------------------
  // PATIENT SUMMARY (ONE SOURCE)
  // ---------------------------------
  patientSummary = computed<PatientSummaryUiDto | null>(() => {
    if (this.mode() === 'edit') {
      const card = this.card();
      return card ? this.mapCardToPatientSummary(card) : null;
    }

    const patient = this.selectedPatient();
    return patient ? this.mapPatientToSummary(patient) : null;
  });

  // ---------------------------------
  // LIFECYCLE
  // ---------------------------------
  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      const idParam = params.get('disabledCardId');
      const id = idParam ? Number(idParam) : null;

      if (id) {
        this.mode.set('edit');
        this.facade.loadDisabledCardForEdit(id);
      } else {
        this.mode.set('create');
        this.facade.enterCreateMode();
      }
    });

    this.route.queryParamMap.subscribe((params) => {
      const pid = params.get('patientId');
      const patientId = pid ? Number(pid) : null;

      this.patientId.set(patientId);

      if (patientId && this.mode() === 'create') {
        this.patientsFacade.loadPatientById(patientId);
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  // ---------------------------------
  // ACTIONS
  // ---------------------------------
  onCreate(dto: AddDisabledCardRequest): void {
    this.facade.createDisabledCard(dto);
  }

  onUpdate(payload: { id: number; dto: UpdateDisabledCardRequest }): void {
    this.facade.updateDisabledCard(payload.id, payload.dto).subscribe();
  }

  onDelete(card: DisabledCardDto): void {
    this.facade.deleteDisabledCard({
      id: card.disabledCardId,
      cardNumber: card.cardNumber,
      fullName: card.fullName,
    } as any);
  }

  // ---------------------------------
  // MAPPING
  // ---------------------------------
  private mapCardToPatientSummary(card: DisabledCardDto): PatientSummaryUiDto {
    return {
      fullName: card.fullName,
      phoneNumber: card.phoneNumber,
      gender: card.gender,
      age: card.age,
    };
  }

  private mapPatientToSummary(patient: PatientDto): PatientSummaryUiDto {
    return {
      fullName: patient.personDto?.fullname ?? '',
      phoneNumber: patient.personDto?.phone ?? '',
      gender: patient.personDto?.gender ?? '',
      age: this.calculateAge(patient.personDto?.birthdate),
    };
  }

  private calculateAge(birthdate?: string): number {
    if (!birthdate) return 0;
    const birth = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }
}
