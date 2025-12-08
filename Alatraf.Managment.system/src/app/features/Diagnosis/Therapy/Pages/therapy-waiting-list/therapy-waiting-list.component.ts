import { Component, inject, signal, OnInit, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PatientCardComponent } from '../../../Shared/Components/waiting-patient-card/waiting-patient-card.component';
import { NavigationDiagnosisFacade } from '../../../../../core/navigation/navigation-diagnosis.facade';
import { TicketDto } from '../../../../Reception/Tickets/models/ticket.model';
import { TicketFacade } from '../../../../Reception/Tickets/tickets.facade.service';
import { PaginationComponent } from "../../../../../shared/components/pagination/pagination.component";

@Component({
  selector: 'app-therapy-waiting-list',
  imports: [RouterOutlet, PatientCardComponent, PaginationComponent],
  templateUrl: './therapy-waiting-list.component.html',
  styleUrl: './therapy-waiting-list.component.css',
})
export class TherapyWaitingListComponent implements OnInit {
 activeDepartment = signal<number | null>(null); // null = "الكل"

 
    ticketFacade = inject(TicketFacade);
  private navDiagnos = inject(NavigationDiagnosisFacade);

  tickets = this.ticketFacade.tickets;
  selectedTicket = signal<TicketDto | null>(null);

  ngOnInit() {
    this.ticketFacade.loadTickets();
  }

  onSearch(term: string) {
    this.ticketFacade.search(term);
  }

 
filterByDepartment(departmentId: number | null) {
  this.activeDepartment.set(departmentId);

  this.ticketFacade.updateFilters({
    departmentId: departmentId ?? undefined,
  });

  this.ticketFacade.setPage(1);
}

  select(ticket: TicketDto) {
    this.selectedTicket.set(ticket);
    this.navDiagnos.goToTherapyCreate(ticket.patient?.patientId!);
  }

  pageRequest = this.ticketFacade.pageRequest;
  totalCount = this.ticketFacade.totalCount;
}

