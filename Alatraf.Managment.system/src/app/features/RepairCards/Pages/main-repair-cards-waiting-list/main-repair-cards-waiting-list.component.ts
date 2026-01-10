import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { DoctorCardComponent } from '../../../../shared/components/doctor-card/doctor-card.component';
import { GeneralWaitingPatientQueueComponent } from '../../../../shared/components/general-waiting-patient-queue/general-waiting-patient-queue.component';

import { RepairCardsNavigationFacade } from '../../../../core/navigation/RepairCards-navigation-facade';

import { GeneralWaitingPatientVM } from '../../../../shared/models/general-waiting-patient.vm';
import { RepairCardDiagnosisDto } from '../../../Diagnosis/Industrial/Models/repair-card-diagnosis.dto';
import { RepairCardsFacade } from '../../Services/repair-cards.facade.service';
import { mapTechnicianToDoctorWorkloadCardVM } from '../../../../core/utils/doctor-workload.mapper';
import { DoctorWorkloadCardVM } from '../../../../shared/models/doctor-workload-card.vm';
import { DoctorWorkloadFacade } from '../../../Organization/Doctors/Service/doctor-workload.facade.service';
import { WorkspaceWelcomeComponent } from "../../../../shared/components/workspace-welcome/workspace-welcome.component";

@Component({
  selector: 'app-main-repair-cards-waiting-list',
  standalone: true,
  imports: [
    DoctorCardComponent,
    GeneralWaitingPatientQueueComponent,
    RouterOutlet,
    WorkspaceWelcomeComponent
  ],
  templateUrl: './main-repair-cards-waiting-list.component.html',
  styleUrl: './main-repair-cards-waiting-list.component.css',
})
export class MainRepairCardsWaitingListComponent {
  private repairCardsFacade = inject(RepairCardsFacade);
  private doctorWorkloadFacade = inject(DoctorWorkloadFacade);

  // ------------------------------------------------------------------
  // Repair cards state (UNCHANGED)
  // ------------------------------------------------------------------
  paidRepairCards = this.repairCardsFacade.paidRepairCards;
  loading = this.repairCardsFacade.loadingPaidRepairCards;
  totalCount = this.repairCardsFacade.paidTotalCount;

  // ------------------------------------------------------------------
  // Navigation (UNCHANGED)
  // ------------------------------------------------------------------
  private navRepairCard = inject(RepairCardsNavigationFacade);

  selectedCardId = signal<number | null>(null);
  SelectedDoctorId = signal<number | null>(null);

  showFirstQueue: boolean = true;
  showSecondQueue: boolean = false;


  patientsVM = computed<GeneralWaitingPatientVM[]>(() =>
    this.paidRepairCards().map((card: RepairCardDiagnosisDto) => ({
      id: card.repairCardId,
      patientNumber: card.patientId,
      cardNumber: card.repairCardId,
      fullName: card.patientName,
      gender: card.gender,
      extraInfo: card.diagnosisType,
    }))
  );

  technicianDoctorsVM = computed<DoctorWorkloadCardVM[]>(() =>
    this.doctorWorkloadFacade
      .technicians()
      .map(mapTechnicianToDoctorWorkloadCardVM)
  );

  loadingTechnicians = this.doctorWorkloadFacade.isLoadingTechnicians;

  ngOnInit(): void {
    this.repairCardsFacade.loadPaidRepairCards().subscribe();

    this.doctorWorkloadFacade.loadTechnicians();
  }

  onSearch(term: string): void {
    this.repairCardsFacade.searchPaid(term);
  }

  select(repaireCard: GeneralWaitingPatientVM): void {
    this.selectedCardId.set(repaireCard.id);
    this.navRepairCard.goToAssignIndustrialPartsPage(repaireCard.id);
  }

  onDoctorSearch(term: string): void {
    this.doctorWorkloadFacade.searchTechnicians(term);
  }

  OnSelectDoctor(doctorSectionRoomId: number): void {
    this.SelectedDoctorId.set(doctorSectionRoomId);
    this.navRepairCard.goToRepairDoctorsListPage(doctorSectionRoomId);
  }

  toggleQueues() {
    this.showFirstQueue = !this.showFirstQueue;
    this.showSecondQueue = !this.showFirstQueue;
  }
}
