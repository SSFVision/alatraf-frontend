import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { DoctorCardComponent } from '../../../../shared/components/doctor-card/doctor-card.component';
import { GeneralWaitingPatientQueueComponent } from '../../../../shared/components/general-waiting-patient-queue/general-waiting-patient-queue.component';

import { RepairCardsNavigationFacade } from '../../../../core/navigation/RepairCards-navigation-facade';

import { GeneralWaitingPatientVM } from '../../../../shared/models/general-waiting-patient.vm';
import { RepairCardDiagnosisDto } from '../../../Diagnosis/Industrial/Models/repair-card-diagnosis.dto';
import { RepairCardsFacade } from '../../Services/repair-cards.facade.service';

@Component({
  selector: 'app-main-repair-cards-waiting-list',
  standalone: true,
  imports: [
    DoctorCardComponent,
    GeneralWaitingPatientQueueComponent,
    RouterOutlet,
  ],
  templateUrl: './main-repair-cards-waiting-list.component.html',
  styleUrl: './main-repair-cards-waiting-list.component.css',
})
export class MainRepairCardsWaitingListComponent {
  // ------------------------------------------------------------------
  // Facade
  // ------------------------------------------------------------------
  private repairCardsFacade = inject(RepairCardsFacade);

  paidRepairCards = this.repairCardsFacade.paidRepairCards;
  loading = this.repairCardsFacade.loadingPaidRepairCards;
  totalCount = this.repairCardsFacade.paidTotalCount;

  // ------------------------------------------------------------------
  // Navigation
  // ------------------------------------------------------------------
  private navRepairCard = inject(RepairCardsNavigationFacade);

  selectedCardId = signal<number | null>(null);

  // ------------------------------------------------------------------
  // View Model mapping
  // ------------------------------------------------------------------
  patientsVM = computed<GeneralWaitingPatientVM[]>(() =>
    this.paidRepairCards().map((card: RepairCardDiagnosisDto) => ({
      id: card.repairCardId,
      patientNumber: card.patientId,
      cardNumber: card.repairCardId,
      fullName: card.patientName,
      gender: card.gender,
      extraInfo:card.diagnosisType
    }))
  );

  // ------------------------------------------------------------------
  // Lifecycle
  // ------------------------------------------------------------------
  ngOnInit(): void {
    this.repairCardsFacade.loadPaidRepairCards().subscribe();
  }

  ngOnDestroy(): void {
    this.repairCardsFacade.resetPaidFilters();
  }

  // ------------------------------------------------------------------
  // UI Actions
  // ------------------------------------------------------------------
  onSearch(term: string): void {
    this.repairCardsFacade.searchPaid(term);
  }


  select(repaireCard: GeneralWaitingPatientVM): void {
    this.selectedCardId.set(repaireCard.id);
    this.navRepairCard.goToAssignIndustrialPartsPage(repaireCard.id);
  }
}
