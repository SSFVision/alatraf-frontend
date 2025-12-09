import { Component, inject, signal, OnInit, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PatientCardComponent } from '../../../Shared/Components/waiting-patient-card/waiting-patient-card.component';
import { NavigationDiagnosisFacade } from '../../../../../core/navigation/navigation-diagnosis.facade';
import { TicketDto } from '../../../../Reception/Tickets/models/ticket.model';
import { TicketFacade } from '../../../../Reception/Tickets/tickets.facade.service';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';
import { Department, ServiceType } from '../../../Shared/enums/department.enum';

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

  // Signals
  tickets = this.ticketFacade.tickets;
  selectedTicket = signal<TicketDto | null>(null);
  ServiceType = ServiceType;  // 👈 expose enum to HTML

  pageRequest = this.ticketFacade.pageRequest;
  totalCount = this.ticketFacade.totalCount;

  ngOnInit() {
    // Load only therapy department tickets
    this.ticketFacade.updateDepartment(Department.Therapy);
    this.ticketFacade.loadTickets();
  }

  // SEARCH
  onSearch(term: string) {
    this.ticketFacade.search(term);
  }

  // Optional: If the therapist chooses a service inside therapy department
  filterByService(serviceId: number | null) {
    this.activeDepartment.set(serviceId);

    this.ticketFacade.updateFilters({
      departmentId: 1, // always therapy department
      serviceId: serviceId ?? undefined,
    });

    this.ticketFacade.setPage(1);
    this.ticketFacade.loadTickets();
  }

  select(ticket: TicketDto) {
    this.selectedTicket.set(ticket);
    this.navDiagnos.goToTherapyCreate(ticket.patient?.patientId!);
  }
}
