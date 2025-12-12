import { TicketStatus } from './../../../../Reception/Tickets/models/ticket.model';
import {
  Component,
  input,
  output,
  
  signal,
} from '@angular/core';
import { TicketDto } from '../../../../Reception/Tickets/models/ticket.model';
import {
  calculateAge,
  formatTicketStatus,
} from '../../Util/patient-ticket.helpers';

@Component({
  selector: 'app-waiting-patient-card',
  imports: [],
  templateUrl: './waiting-patient-card.component.html',
  styleUrl: './waiting-patient-card.component.css',
})
export class PatientCardComponent {
  tickets = input<TicketDto[]>([]);
  loading = input<boolean>(false);

  select = output<TicketDto>();

  selectedTicketId = signal<number | null>(null);

titcketStatus=TicketStatus;

  onSelect(ticket: TicketDto): void {
    this.selectedTicketId.set(ticket.ticketId);
    this.select.emit(ticket);
  }

  getAgeFromBirthdate(date: string | undefined): number {
    
    const age=calculateAge(date);
    // console.log(" age for this patient : ",age);
  return age;
  }

  getTicketStatusLabel(status: string) {
    return formatTicketStatus(status);
  }
}
