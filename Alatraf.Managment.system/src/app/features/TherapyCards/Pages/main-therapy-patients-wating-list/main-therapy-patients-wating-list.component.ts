import { Subject } from 'rxjs';
import { Component, computed, inject, OnDestroy, signal } from '@angular/core';

import { Department } from '../../../Diagnosis/Shared/enums/department.enum';
import { RouterOutlet } from '@angular/router';
import { TherapyCardsNavigationFacade } from '../../../../core/navigation/TherapyCards-navigation.facade';
import { PatientCardComponent } from '../../../../shared/components/waiting-patient-card/waiting-patient-card.component';
import { DoctorCardComponent } from '../../../../shared/components/doctor-card/doctor-card.component';
import { TherapyCardDiagnosisDto } from '../../../Diagnosis/Therapy/Models/therapy-card-diagnosis.dto';
import { TherapySessionsFacade } from '../../services/therapy-sessions.facade.service';
import { GeneralWaitingPatientQueueComponent } from '../../../../shared/components/general-waiting-patient-queue/general-waiting-patient-queue.component';
import { GeneralWaitingPatientVM } from '../../../../shared/models/general-waiting-patient.vm';

@Component({
  selector: 'app-main-therapy-patients-wating-list',
  imports: [
    RouterOutlet,
    DoctorCardComponent,
    GeneralWaitingPatientQueueComponent,
  ],
  templateUrl: './main-therapy-patients-wating-list.component.html',
  styleUrl: './main-therapy-patients-wating-list.component.css',
})
export class MainTherapyPatientsWatingListComponent implements OnDestroy {
  private sessionsFacade = inject(TherapySessionsFacade);

  paidTherapyCards = this.sessionsFacade.paidTherapyCards;
  loading = this.sessionsFacade.loadingPaidTherapyCards;
  totalCount = this.sessionsFacade.paidTotalCount;

 
  private navTherapyCard = inject(TherapyCardsNavigationFacade);

  selectedCardId = signal<number | null>(null);

  
  patientsVM = computed<GeneralWaitingPatientVM[]>(() =>
    this.paidTherapyCards().map((card: TherapyCardDiagnosisDto) => ({
      id: card.therapyCardId,
      patientNumber: card.patientId,
      cardNumber: card.therapyCardId,
      fullName: card.patientName,
      gender: card.gender,
    }))
  );

  // ------------------------------------------------------------------
  // Lifecycle
  // ------------------------------------------------------------------
  ngOnInit(): void {
    this.sessionsFacade.loadPaidTherapyCards();
  }

  ngOnDestroy(): void {
    this.sessionsFacade.resetPaidFilters();
  }

  // ------------------------------------------------------------------
  // UI Actions
  // ------------------------------------------------------------------
  onSearch(term: string): void {
    this.sessionsFacade.searchPaid(term);
  }

  onPageChange(page: number): void {
    this.sessionsFacade.setPaidPage(page);
  }

  select(patient: GeneralWaitingPatientVM): void {
    this.selectedCardId.set(patient.id);

    this.navTherapyCard.goToCreateTherapySessionPage(patient.id);
  }
}
