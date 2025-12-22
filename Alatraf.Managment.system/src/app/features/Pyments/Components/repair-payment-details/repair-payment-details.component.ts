import { Component, Input } from '@angular/core';
import { RepairPaymentDto } from '../../Models/repair-payment.dto';

@Component({
  selector: 'app-repair-payment-details',
    standalone: true,

  imports: [],
  templateUrl: './repair-payment-details.component.html',
  styleUrl: './repair-payment-details.component.css'
})
export class RepairPaymentDetailsComponent {
  @Input({ required: true }) data!: RepairPaymentDto;

}
