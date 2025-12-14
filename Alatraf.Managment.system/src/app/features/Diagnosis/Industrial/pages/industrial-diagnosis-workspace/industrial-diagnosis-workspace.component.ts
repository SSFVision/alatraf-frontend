import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { HeaderPatientInfoComponent } from '../../../../../shared/components/header-patient-info/header-patient-info.component';
import { AddIndustrialDiagnosisFormComponent } from '../../Components/add-industrial-diagnosis-form/add-industrial-diagnosis-form.component';
import { PreviousIndustrialDiagnosisComponent } from '../../Components/previous-industrial-diagnosis/previous-industrial-diagnosis.component';

import { ToastService } from '../../../../../core/services/toast.service';

import { TicketFacade } from '../../../../Reception/Tickets/tickets.facade.service';

import { CreateRepairCardRequest } from '../../Models/create-repair-card.request';
import { UpdateRepairCardRequest } from '../../Models/update-repair-card.request';
import { RepairCardDiagnosisDto } from '../../Models/repair-card-diagnosis.dto';

import {
  MOCK_INDUSTRIAL_DIAGNOSIS_HISTORY,
  IndustrialDiagnosisHistoryDto,
} from '../../Models/industrial-diagnosis-history.dto';
import { RepairCardDiagnosisFacade } from '../../Services/repair-card-diagnosis.facade.service';

@Component({
  selector: 'app-industrial-diagnosis-workspace',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HeaderPatientInfoComponent,
    AddIndustrialDiagnosisFormComponent,
    PreviousIndustrialDiagnosisComponent,
  ],
  templateUrl: './industrial-diagnosis-workspace.component.html',
  styleUrl: './industrial-diagnosis-workspace.component.css',
})
export class IndustrialDiagnosisWorkspaceComponent implements OnInit {
  // ------------------------------
  // INJECTIONS
  // ------------------------------
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private toast = inject(ToastService);

  private ticketFacade = inject(TicketFacade);
  private repairFacade = inject(RepairCardDiagnosisFacade);

  // ------------------------------
  // STATE
  // ------------------------------
  ticket = this.ticketFacade.selectedTicket;
  isLoading = this.ticketFacade.loadingTicket;

  viewMode = signal<'add' | 'history'>('add');

  injuryReasons = this.repairFacade.injuryReasons;
  injurySides = this.repairFacade.injurySides;
  injuryTypes = this.repairFacade.injuryTypes;
  industrialParts = this.repairFacade.industrialParts;
  isLookupLoading = this.repairFacade.loadingLookups;

  isEditMode = this.repairFacade.isEditMode;

  existingCard = signal<RepairCardDiagnosisDto | null>(null);

  // Mock history for now
  industrialHistoryItems = MOCK_INDUSTRIAL_DIAGNOSIS_HISTORY;

  ngOnInit(): void {
    this.repairFacade.loadLookups();

    this.listenToRouteChanges();
  }

  private listenToRouteChanges() {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const ticketId = Number(params.get('ticketId'));

        if (!ticketId || Number.isNaN(ticketId)) {
          this.isLoading.set(false);
          return;
        }

        this.ticketFacade.loadTicketById(ticketId);
      });
  }

  // ------------------------------
  // VIEW MODE
  // ------------------------------
  switchToAdd() {
    this.viewMode.set('add');
    this.repairFacade.enterCreateMode();
    this.existingCard.set(null);
  }

  switchToHistory() {
    this.viewMode.set('history');
  }

  // ------------------------------
  // SAVE HANDLER
  // ------------------------------
  saveIndustrialDiagnosis(
    dto: CreateRepairCardRequest | UpdateRepairCardRequest
  ) {
    if (this.isEditMode()) {
      const current = this.existingCard();
      if (!current) {
        this.toast.error('لا توجد بطاقة إصلاح محددة للتعديل');
        return;
      }

      this.repairFacade
        .updateRepairCard(current.repairCardId, dto as UpdateRepairCardRequest)
        .subscribe();
    } else {
      this.repairFacade
        .createRepairCard(dto as CreateRepairCardRequest)
        .subscribe();
    }
  }

  // ------------------------------
  // HISTORY HANDLER (placeholder)
  // ------------------------------
  openHistoryDetails(item: IndustrialDiagnosisHistoryDto) {
    // لاحقاً: يمكنك هنا استدعاء API لجلب RepairCardDiagnosisDto حقيقي
    console.log('View industrial diagnosis history details:', item);
    // مثال مستقبلي:
    // this.repairFacade.loadRepairCardForEdit(item.repairCardId);
    // this.existingCard.set(.... من الفاساد ....);
    // this.viewMode.set('add');
  }
}
