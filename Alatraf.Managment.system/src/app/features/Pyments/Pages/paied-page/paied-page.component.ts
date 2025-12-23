import { Component, DestroyRef, inject, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { PaymentReference } from '../../Models/payment-reference.enum';
import { AccountKind } from '../../Models/account-kind.enum';
import { PaymentSubmitEvent } from '../../Models/payment-submit-event';

import { TherapyPaymentDetailsComponent } from '../../Components/therapy-payment-details/therapy-payment-details.component';
import { RepairPaymentDetailsComponent } from '../../Components/repair-payment-details/repair-payment-details.component';
import { PaymentActionsComponent } from '../../Components/payment-actions/payment-actions.component';

import { PaymentsProcessingFacade } from '../../Services/payments-processing.facade.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-paied-page',
  standalone: true,
  imports: [
    NgIf,
    TherapyPaymentDetailsComponent,
    RepairPaymentDetailsComponent,
    PaymentActionsComponent,
  ],
  templateUrl: './paied-page.component.html',
  styleUrl: './paied-page.component.css',
})
export class PaiedPageComponent {
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private processingFacade = inject(PaymentsProcessingFacade);

  paymentId = signal<number | null>(null);
  paymentReference = signal<PaymentReference | null>(null);
  paymentType = signal<'therapy' | 'repair' | null>(null);

  isLoading = this.processingFacade.isLoading;

  therapyPayment = this.processingFacade.therapyPayment;
  repairPayment = this.processingFacade.repairPayment;
  isPaying = this.processingFacade.isPaying;

  totalAmount = computed<number>(() => {
    if (this.paymentType() === 'therapy') {
      return this.therapyPayment()?.totalAmount ?? 0;
    }

    if (this.paymentType() === 'repair') {
      return this.repairPayment()?.totalAmount ?? 0;
    }

    return 0;
  });

  allowedAccountKinds = signal<AccountKind[]>([]);

  ngOnInit(): void {
    this.listenToRouteParams();
  }

  ngOnDestroy(): void {
    this.processingFacade.reset();
  }

  private listenToRouteParams(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const idParam = params.get('paymentId');
        const referenceParam = params.get('paymentReference');

        const id = idParam ? Number(idParam) : NaN;
        const reference = this.parsePaymentReference(referenceParam);

        if (!id || Number.isNaN(id) || reference === null) {
          this.resetState();
          return;
        }

        this.paymentId.set(id);
        this.paymentReference.set(reference);

        const type = this.resolvePaymentType(reference);
        this.paymentType.set(type);

        this.resolveAllowedAccountKinds(reference);
        this.loadPayment(id, reference, type);
      });
  }

  private loadPayment(
    paymentId: number,
    reference: PaymentReference,
    type: 'therapy' | 'repair' | null
  ): void {
    if (type === 'therapy') {
      this.processingFacade.loadTherapyPayment(paymentId, reference);
    }

    if (type === 'repair') {
      this.processingFacade.loadRepairPayment(paymentId, reference);
    }
  }


onSubmitPayment(event: PaymentSubmitEvent): void {

    console.log('AccountKind:', event.accountKind);
    console.log('Payload:', event.payload);

  const paymentId = this.paymentId();
  const reference = this.paymentReference();

  if (!paymentId || reference === null) {
    return;
  }

  switch (event.accountKind) {
    case AccountKind.Free:
      this.processingFacade.payFree(paymentId).subscribe();
      break;

    case AccountKind.Patient:
      this.processingFacade.payPatient(paymentId, {
        paidAmount: event.payload?.paidAmount,
        discount: event.payload?.discount ?? 0, // نسبة %
        voucherNumber: event.payload?.voucherNumber,
        notes: event.payload?.notes ?? null,
      }).subscribe();
      break;

    case AccountKind.Disabled:
      this.processingFacade.payDisabled(paymentId, {
        disabledCardId: event.payload?.disabledCardId,
        notes: event.payload?.notes ?? null,
      }).subscribe();
      break;

    case AccountKind.Wounded:
      this.processingFacade.payWounded(paymentId, {
        reportNumber: event.payload?.reportNumber ?? null,
        notes: event.payload?.notes ?? null,
      }).subscribe();
      break;
  }
}

  /* ---------------------------------------------
   * HELPERS
   * --------------------------------------------- */

  private parsePaymentReference(value: string | null): PaymentReference | null {
    if (!value) return null;

    const normalized = value.toLowerCase();

    const match = Object.entries(PaymentReference).find(
      ([key]) => key.toLowerCase() === normalized
    );

    return match ? (PaymentReference as any)[match[0]] : null;
  }

  private resolvePaymentType(
    reference: PaymentReference
  ): 'therapy' | 'repair' | null {
    switch (reference) {
      case PaymentReference.TherapyCardNew:
      case PaymentReference.TherapyCardRenew:
      case PaymentReference.TherapyCardDamagedReplacement:
        return 'therapy';

      case PaymentReference.Repair:
        return 'repair';

      default:
        return null;
    }
  }

  private resetState(): void {
    this.paymentId.set(null);
    this.paymentReference.set(null);
    this.paymentType.set(null);
    this.allowedAccountKinds.set([]);
    this.processingFacade.reset();
  }

  private resolveAllowedAccountKinds(reference: PaymentReference): void {
    switch (reference) {
      case PaymentReference.TherapyCardNew:
      case PaymentReference.TherapyCardRenew:
      case PaymentReference.TherapyCardDamagedReplacement:
        this.allowedAccountKinds.set([
          AccountKind.Patient,
          AccountKind.Disabled,
          AccountKind.Wounded,
          AccountKind.Free,
        ]);
        break;

      case PaymentReference.Repair:
        this.allowedAccountKinds.set([
          AccountKind.Patient,
          AccountKind.Free,
        ]);
        break;

      case PaymentReference.Sales:
        this.allowedAccountKinds.set([AccountKind.Patient,
          AccountKind.Disabled,

        ]);
        break;

      default:
        this.allowedAccountKinds.set([]);
    }
  }
}
