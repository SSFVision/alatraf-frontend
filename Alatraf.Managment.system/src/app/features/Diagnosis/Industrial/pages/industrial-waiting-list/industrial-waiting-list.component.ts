import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationDiagnosisFacade } from '../../../../../core/navigation/navigation-diagnosis.facade';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';
import { TicketDto, TicketStatus } from '../../../../Reception/Tickets/models/ticket.model';
import { TicketFacade } from '../../../../Reception/Tickets/tickets.facade.service';
import { ServiceType, Department } from '../../../Shared/enums/department.enum';
import { PatientCardComponent } from "../../../../../shared/components/waiting-patient-card/waiting-patient-card.component";

@Component({
  selector: 'app-industrial-waiting-list',
  imports: [RouterOutlet, PaginationComponent, PatientCardComponent],
  templateUrl: './industrial-waiting-list.component.html',
  styleUrl: './industrial-waiting-list.component.css',
})
export class IndustrialWaitingListComponent implements OnInit, OnDestroy {
  activeService = signal<number | null>(null);

  ticketFacade = inject(TicketFacade);
  private navDiagnos = inject(NavigationDiagnosisFacade);

  tickets = this.ticketFacade.tickets;
  selectedTicket = signal<TicketDto | null>(null);
  ServiceType = ServiceType;
  loading = this.ticketFacade.isLoading;

  pageRequest = this.ticketFacade.pageRequest;
  totalCount = this.ticketFacade.totalCount;

  ngOnInit() {
    this.ticketFacade.updateFilters({departmentId:Department.Industrial,status:TicketStatus.New});
    this.ticketFacade.loadTickets();
  }
  ngOnDestroy() {
    this.ticketFacade.resetFilters();
  }
  onSearch(term: string) {
    this.ticketFacade.search(term);
  }

  filterByService(serviceId: number | null) {
    this.activeService.set(serviceId);
    this.ticketFacade.updateFilters({
      departmentId: Department.Industrial,
      serviceId: serviceId ?? undefined,
    });
    this.ticketFacade.setPage(1);
  }
  select(ticket: TicketDto) {
    this.selectedTicket.set(ticket);
    this.navDiagnos.goToIndustrialCreate(ticket.ticketId);
  }
}
