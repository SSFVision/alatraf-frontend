import { Component, inject, OnDestroy, signal } from '@angular/core';

import { Department } from '../../../Diagnosis/Shared/enums/department.enum';
import { RouterOutlet } from '@angular/router';
import { TherapyCardsNavigationFacade } from '../../../../core/navigation/TherapyCards-navigation.facade';
import { PatientCardComponent } from "../../../../shared/components/waiting-patient-card/waiting-patient-card.component";
import { DoctorCardComponent } from "../../../../shared/components/doctor-card/doctor-card.component";
import { TherapyCardDiagnosisDto } from '../../../Diagnosis/Therapy/Models/therapy-card-diagnosis.dto';
import { TherapySessionsFacade } from '../../services/therapy-sessions.facade.service';

@Component({
  selector: 'app-main-therapy-patients-wating-list',
  imports: [RouterOutlet, DoctorCardComponent],
  templateUrl: './main-therapy-patients-wating-list.component.html',
  styleUrl: './main-therapy-patients-wating-list.component.css',
})
export class MainTherapyPatientsWatingListComponent implements OnDestroy {
 private sessionsFacade = inject(TherapySessionsFacade);

  paidTherapyCards = this.sessionsFacade.paidTherapyCards;
  loading = this.sessionsFacade.loadingPaidTherapyCards;
  totalCount = this.sessionsFacade.paidTotalCount;
  private navTherapyCard = inject(TherapyCardsNavigationFacade);

  selectedCard = signal<TherapyCardDiagnosisDto | null>(null);
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
    this.sessionsFacade.updatePaidFilters({ searchTerm: term });
    this.sessionsFacade.loadPaidTherapyCards();
  }

  onPageChange(page: number): void {
    this.sessionsFacade.setPaidPage(page);
  }

  select(card: TherapyCardDiagnosisDto): void {
    this.selectedCard.set(card);

    // 🔥 التنقل الصحيح: باستخدام therapyCardId
    this.navTherapyCard.goToCreateTherapySessionPage(
      card.therapyCardId
    );
  }}
