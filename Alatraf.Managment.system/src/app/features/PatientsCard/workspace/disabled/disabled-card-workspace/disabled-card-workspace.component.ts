import { RequestInfo } from 'angular-in-memory-web-api';
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
import { AddDisabledCardRequest } from '../../../models/disabled-Models/add-disabled-card.request';
import { DisabledCardDto } from '../../../models/disabled-Models/disabled-card.dto';
import { UpdateDisabledCardRequest } from '../../../models/disabled-Models/update-disabled-card.request';

import { DisabledCardFormComponent } from '../../../components/disabled-card-form/disabled-card-form.component';
import { PatientSummaryHeaderComponent } from '../../../../../shared/components/patient-summary-header/patient-summary-header.component';
import { PatientSummaryUiDto } from '../../../../../shared/models/patient-summary.ui-dto';

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

  mode = signal<DisabledCardWorkspaceMode>('create');

  // facade signals
  card = this.facade.selectedDisabledCard;
  saving = this.facade.saving;
  loadingItem = this.facade.loadingItem;

  isLoading = computed(() => this.loadingItem() || this.saving());

  patientSummary = computed<PatientSummaryUiDto | null>(() => {
    const card = this.card();
    if (!card || this.mode() !== 'edit') return null;

    return this.mapCardToPatientSummary(card);
  });

  private routeSub?: Subscription;

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
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  onCreate(dto: AddDisabledCardRequest): void {
    console.log('Created RequestInfo', dto);
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
  // MAPPING METHOD (UI DTO)
  // ---------------------------------
  private mapCardToPatientSummary(card: DisabledCardDto): PatientSummaryUiDto {
    return {
      fullName: card.fullName,
      phoneNumber: card.phoneNumber,
      gender: card.gender,
      age: card.age,
    };
  }
}
