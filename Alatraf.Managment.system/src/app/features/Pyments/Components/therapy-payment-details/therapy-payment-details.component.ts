import { Component, Input } from '@angular/core';
import { TherapyPaymentDto } from '../../Models/therapy-payment.dto';

@Component({
  selector: 'app-therapy-payment-details',
  imports: [],
  templateUrl: './therapy-payment-details.component.html',
  styleUrl: './therapy-payment-details.component.css'
})
export class TherapyPaymentDetailsComponent {
  @Input({ required: true }) data!: TherapyPaymentDto;

}
