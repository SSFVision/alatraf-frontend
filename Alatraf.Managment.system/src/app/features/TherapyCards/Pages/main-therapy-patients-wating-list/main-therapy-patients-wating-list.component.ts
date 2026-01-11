import { Component, computed, inject, OnDestroy, signal } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { TherapyCardsNavigationFacade } from '../../../../core/navigation/TherapyCards-navigation.facade';
import { mapTherapistToDoctorWorkloadCardVM } from '../../../../core/utils/doctor-workload.mapper';
import { DoctorCardComponent } from '../../../../shared/components/doctor-card/doctor-card.component';
import { GeneralWaitingPatientQueueComponent } from '../../../../shared/components/general-waiting-patient-queue/general-waiting-patient-queue.component';
import { DoctorWorkloadCardVM } from '../../../../shared/models/doctor-workload-card.vm';
import { GeneralWaitingPatientVM } from '../../../../shared/models/general-waiting-patient.vm';
import { TherapyCardDiagnosisDto } from '../../../Diagnosis/Therapy/Models/therapy-card-diagnosis.dto';
import { DoctorWorkloadFacade } from '../../../Organization/Doctors/Service/doctor-workload.facade.service';
import { TherapySessionsFacade } from '../../services/therapy-sessions.facade.service';
import { WorkspaceWelcomeComponent } from "../../../../shared/components/workspace-welcome/workspace-welcome.component";

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
  private doctorWorkloadFacade = inject(DoctorWorkloadFacade);
  private navTherapyCard = inject(TherapyCardsNavigationFacade);


  paidTherapyCards = this.sessionsFacade.paidTherapyCards;
  loading = this.sessionsFacade.loadingPaidTherapyCards;
  totalCount = this.sessionsFacade.paidTotalCount;

  selectedCardId = signal<number | null>(null);
  selectedDoctorId = signal<number | null>(null);

  showFirstQueue: boolean = true;
  showSecondQueue: boolean = false;


  patientsVM = computed<GeneralWaitingPatientVM[]>(() =>
    this.paidTherapyCards().map((card: TherapyCardDiagnosisDto) => ({
      id: card.therapyCardId,
      patientNumber: card.patientId,
      cardNumber: card.therapyCardId,
      fullName: card.patientName,
      gender: card.gender,
      extraInfo: card.diagnosisType,
    }))
  );


  therapistDoctorsVM = computed<DoctorWorkloadCardVM[]>(() =>
    this.doctorWorkloadFacade
      .therapists()
      .map(mapTherapistToDoctorWorkloadCardVM)
  );

  loadingTherapists = this.doctorWorkloadFacade.isLoadingTherapists

  ngOnInit(): void {
    this.sessionsFacade.loadPaidTherapyCards();

    this.doctorWorkloadFacade.loadTherapists();
  }

  ngOnDestroy(): void {
    this.sessionsFacade.resetPaidFilters();
    this.doctorWorkloadFacade.resetTherapists();
  }


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


  onDoctorSearch(term: string): void {
    this.doctorWorkloadFacade.searchTherapists(term);
  }

  onDoctorPageChange(page: number): void {
    this.doctorWorkloadFacade.setTherapistsPage(page);
  }

  OnSelectDoctor(doctorSectionRoomId: number): void {
    this.selectedDoctorId.set(doctorSectionRoomId);
    this.navTherapyCard.goToTherapyDoctorsListPage(doctorSectionRoomId);
  }

  toggleQueues() {
    this.showFirstQueue = !this.showFirstQueue;
    this.showSecondQueue = !this.showFirstQueue;
  }

}
