import { Component, Input } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { ACCOUNT_KIND_LABELS } from '../../Constants/account-kind-labels';
import { PaymentSummaryDto } from '../../Shared/payment-summary.dto';

@Component({
  selector: 'app-payment-summary',
  standalone: true,
  imports: [NgIf,DatePipe],
  templateUrl: './payment-summary.component.html',
  styleUrl: './payment-summary.component.css',
})
export class PaymentSummaryComponent {
  @Input({ required: true }) summary!: PaymentSummaryDto;

  ACCOUNT_KIND_LABELS = ACCOUNT_KIND_LABELS;

  get netAmount(): number {
    const discount = this.summary.discount ?? 0;
    return (
      this.summary.totalAmount -
      (this.summary.totalAmount * discount) / 100
    );
  }
}
