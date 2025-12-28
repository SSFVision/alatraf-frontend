import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppointmentsNavigationFacade } from '../../../../core/navigation/Appointments-navigation.facade';
import { ToastService } from '../../../../core/services/toast.service';
import { PatientCardComponent } from '../../../../shared/components/waiting-patient-card/waiting-patient-card.component';
import {
  Department,
  ServiceType,
} from '../../../Diagnosis/Shared/enums/department.enum';
import {
  TicketDto,
  TicketStatus,
} from '../../../Reception/Tickets/models/ticket.model';
import { TicketFacade } from '../../../Reception/Tickets/tickets.facade.service';

@Component({
  selector: 'app-main-apointment-waiting-patient',
  imports: [RouterOutlet, PatientCardComponent],
  templateUrl: './main-apointment-waiting-patient.component.html',
  styleUrl: './main-apointment-waiting-patient.component.css',
})
export class MainApointmentWaitingPatientComponent {
  private nav = inject(AppointmentsNavigationFacade);
  private toast = inject(ToastService);
  ticketFacade = inject(TicketFacade);
  tickets = this.ticketFacade.tickets;
  ServiceType = ServiceType;
  isloading = this.ticketFacade.isLoading;
  pageRequest = this.ticketFacade.pageRequest;
  totalCount = this.ticketFacade.totalCount;

  ngOnInit() {
    this.ticketFacade.updateFilters({
      departmentId: Department.Industrial,
      status: TicketStatus.New,
      serviceId: ServiceType.Industrial,
    });
    this.ticketFacade.loadTickets();
  }
  ngOnDestroy() {
    this.ticketFacade.resetFilters();
  }
  onSearch(term: string) {
    this.ticketFacade.search(term);
  }

  OnSelectPatientTicket(ticket: TicketDto) {
    this.nav.goToSchedulaPage(ticket.ticketId);
  }
}
