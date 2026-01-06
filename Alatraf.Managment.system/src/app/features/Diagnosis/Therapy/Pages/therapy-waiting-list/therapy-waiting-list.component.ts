import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationDiagnosisFacade } from '../../../../../core/navigation/navigation-diagnosis.facade';
import { PatientCardComponent } from '../../../../../shared/components/waiting-patient-card/waiting-patient-card.component';
import {
  TicketDto,
  TicketStatus,
} from '../../../../Reception/Tickets/models/ticket.model';
import { TicketFacade } from '../../../../Reception/Tickets/tickets.facade.service';
import { Department, ServiceType } from '../../../Shared/enums/department.enum';
import { WorkspaceWelcomeComponent } from "../../../../../shared/components/workspace-welcome/workspace-welcome.component";

@Component({
  selector: 'app-therapy-waiting-list',
  imports: [RouterOutlet, PatientCardComponent, WorkspaceWelcomeComponent],
  templateUrl: './therapy-waiting-list.component.html',
  styleUrl: './therapy-waiting-list.component.css',
})
export class TherapyWaitingListComponent implements OnInit, OnDestroy {
  activeService = signal<number | null>(null); // null = "الكل"

  ticketFacade = inject(TicketFacade);
  private navDiagnos = inject(NavigationDiagnosisFacade);

  // Signals
  tickets = this.ticketFacade.tickets;
  selectedTicket = signal<TicketDto | null>(null);
  ServiceType = ServiceType;
  loading = this.ticketFacade.isLoading;
  pageRequest = this.ticketFacade.pageRequest;
  totalCount = this.ticketFacade.totalCount;

  ngOnInit() {
    this.ticketFacade.updateFilters({
      departmentId: Department.Therapy,
      status: TicketStatus.New,
    });
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
      departmentId: Department.Therapy, // always therapy department
      serviceId: serviceId ?? undefined,
    });

    this.ticketFacade.setPage(1);
  }

  select(ticket: TicketDto) {
    this.selectedTicket.set(ticket);
    this.navDiagnos.goToTherapyCreate(ticket.ticketId);
  }
}
