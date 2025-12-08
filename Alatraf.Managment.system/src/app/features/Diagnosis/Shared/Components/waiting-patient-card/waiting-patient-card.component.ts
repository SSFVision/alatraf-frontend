import { Patient } from '../../../../Reception/Patients/models/patient.model';
import {
  Component,
  EventEmitter,
  input,
  Input,
  output,
  Output,
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

  onSelect(ticket: TicketDto): void {
    this.selectedTicketId.set(ticket.ticketId);
    this.select.emit(ticket);
  }

  getAgeFromBirthdate(date: string | undefined): number {
    return calculateAge(date);
  }

  getTicketStatusLabel(status: string) {
    return formatTicketStatus(status);
  }
}
