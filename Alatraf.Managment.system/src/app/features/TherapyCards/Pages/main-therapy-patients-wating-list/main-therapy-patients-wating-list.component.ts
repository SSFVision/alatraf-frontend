import { Component, inject, OnDestroy, signal } from '@angular/core';
import { TicketFacade } from '../../../Reception/Tickets/tickets.facade.service';
import {
  TicketDto,
  TicketStatus,
} from '../../../Reception/Tickets/models/ticket.model';
import { Department } from '../../../Diagnosis/Shared/enums/department.enum';
import { RouterOutlet } from '@angular/router';
import { TherapyCardsNavigationFacade } from '../../../../core/navigation/TherapyCards-navigation.facade';
import { PatientCardComponent } from "../../../../shared/components/waiting-patient-card/waiting-patient-card.component";
import { DoctorCardComponent } from "../../../../shared/components/doctor-card/doctor-card.component";

@Component({
  selector: 'app-main-therapy-patients-wating-list',
  imports: [RouterOutlet, PatientCardComponent, DoctorCardComponent],
  templateUrl: './main-therapy-patients-wating-list.component.html',
  styleUrl: './main-therapy-patients-wating-list.component.css',
})
export class MainTherapyPatientsWatingListComponent implements OnDestroy {
  ticketFacade = inject(TicketFacade);
  tickets = this.ticketFacade.tickets;
  selectedTicket = signal<TicketDto | null>(null);

  private navTherapyCard = inject(TherapyCardsNavigationFacade);

  ngOnInit() {
    this.ticketFacade.updateFilters({ departmentId: Department.Therapy });
    this.ticketFacade.loadTickets();
  }

  ngOnDestroy() {
    this.ticketFacade.resetFilters();
  }
  onSearch(term: string) {
    this.ticketFacade.search(term);
  }
  select(ticket: TicketDto) {
    this.selectedTicket.set(ticket);
    this.navTherapyCard.goToCreateTherapySessionPage(ticket.ticketId);
  }
}
