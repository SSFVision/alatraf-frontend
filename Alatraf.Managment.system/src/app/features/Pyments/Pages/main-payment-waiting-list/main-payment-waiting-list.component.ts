import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { GeneralWaitingPatientQueueComponent } from '../../../../shared/components/general-waiting-patient-queue/general-waiting-patient-queue.component';

import { PaymentsNavigationFacade } from '../../../../core/navigation/payments-navigation.facade';

import { GeneralWaitingPatientVM } from '../../../../shared/models/general-waiting-patient.vm';
import { PaymentWaitingListDto } from '../../Models/payment-waitingList-dto';
import { PaymentReference } from '../../Models/payment-reference.enum';
import { PaymentsWaitingListFacade } from '../../Services/payments-waiting-list.facade.service';
import { WorkspaceWelcomeComponent } from "../../../../shared/components/workspace-welcome/workspace-welcome.component";

@Component({
  selector: 'app-main-payment-waiting-list',
  standalone: true,
  imports: [GeneralWaitingPatientQueueComponent, RouterOutlet, WorkspaceWelcomeComponent],
  templateUrl: './main-payment-waiting-list.component.html',
  styleUrl: './main-payment-waiting-list.component.css',
})
export class MainPaymentWaitingListComponent {
  private paymentsFacade = inject(PaymentsWaitingListFacade);

  waitingPayments = this.paymentsFacade.waitingList;
  loading = this.paymentsFacade.loadingWaitingList;
  totalCount = this.paymentsFacade.totalCount;

  private navPayment = inject(PaymentsNavigationFacade);

  selectedPaymentId = signal<number | null>(null);

  PaymentReference = PaymentReference;
  currentPaymentReference = signal<PaymentReference | null>(null);
  isCompleted = signal<boolean | null>(null);
  patientsVM = computed<GeneralWaitingPatientVM[]>(() =>
    this.waitingPayments().map((payment: PaymentWaitingListDto) => ({
      id: payment.paymentId,
      patientNumber: payment.cardId,
      cardNumber: payment.cardId,
      fullName: payment.patientName,
      gender: payment.gender ?? 'غير محدد',
      referenceType: payment.paymentReference, // IMPORTANT
      extraInfo: payment.paymentReference,
    }))
  );
  // extraInfo: PaymentReference[payment.paymentReference],
  // referenceType: payment.paymentReference, // enum

  ngOnInit(): void {
    this.isCompleted.set(false);
    this.paymentsFacade.updateFilters({
      isCompleted: false,
    });
    this.paymentsFacade.loadPaymentsWaitingList();
  }

  ngOnDestroy(): void {
    this.paymentsFacade.resetFilters();
  }

  // ------------------------------------------------------------------
  // UI Actions
  // ------------------------------------------------------------------
  onSearch(term: string) {
    this.paymentsFacade.search(term);
  }

  select(vm: GeneralWaitingPatientVM): void {
    if (vm.referenceType == null) return;

    this.selectedPaymentId.set(vm.id);
    this.navPayment.goToPaiedPage(vm.id, vm.referenceType);
  }

  selectFilter(reference: PaymentReference | null): void {
    this.currentPaymentReference.set(reference);
    this.paymentsFacade.updateFilters({
      paymentReference: reference,
    });
  }

  setPaymentStatus(isCompleted: boolean): void {
    this.isCompleted.set(isCompleted);

    this.paymentsFacade.updateFilters({
      isCompleted,
    });
    this.paymentsFacade.loadPaymentsWaitingList();

  }
}
