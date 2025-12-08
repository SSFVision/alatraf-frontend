// import { Component, inject, signal, OnInit } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { PatientCardComponent } from '../../../Shared/Components/waiting-patient-card/waiting-patient-card.component';
// import { Patient } from '../../../../Reception/Patients/models/patient.model';
// import { PatientsFacade } from '../../../../Reception/Patients/Services/patients.facade.service';
// import { NavigationDiagnosisFacade } from '../../../../../core/navigation/navigation-diagnosis.facade';

// @Component({
//   selector: 'app-therapy-waiting-list',
//   imports: [RouterOutlet, PatientCardComponent],
//   templateUrl: './therapy-waiting-list.component.html',
//   styleUrl: './therapy-waiting-list.component.css',
// })
// export class TherapyWaitingListComponent implements OnInit {
//   selectedPatient = signal<Patient |null>(null);
//   private facade = inject(PatientsFacade);
//   patients = this.facade.patients;
//   private navDiagnos = inject(NavigationDiagnosisFacade);
//   ngOnInit() {
//     this.facade.loadPatients();
//   }
//  onSearch(term: string) {
//     this.facade.search(term);
//   }

//   selectPatient(patient: Patient) {
//     this.selectedPatient.set(patient);
//     this.navDiagnos.goToTherapyCreate(patient.patientId);
//   }
// }

import { Component, inject, signal, OnInit, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PatientCardComponent } from '../../../Shared/Components/waiting-patient-card/waiting-patient-card.component';
import { NavigationDiagnosisFacade } from '../../../../../core/navigation/navigation-diagnosis.facade';
import { PatientDto } from '../../../../../core/models/Shared/patient.model';
import { TicketDto } from '../../../../Reception/Tickets/models/ticket.model';
import { TicketService } from '../../../../Reception/Tickets/ticket.service';
import { TicketFacade } from '../../../../Reception/Tickets/tickets.facade.service';

@Component({
  selector: 'app-therapy-waiting-list',
  imports: [RouterOutlet, PatientCardComponent],
  templateUrl: './therapy-waiting-list.component.html',
  styleUrl: './therapy-waiting-list.component.css',
})
export class TherapyWaitingListComponent implements OnInit {
 
 
  private ticketFacade = inject(TicketFacade);
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
    // this.ticketFacade.updateFilters({ serviceId: departmentId ?? undefined });
    this.ticketFacade.loadTickets();
  }

  select(ticket: TicketDto) {
    this.selectedTicket.set(ticket);
    this.navDiagnos.goToTherapyCreate(ticket.patient?.patientId!);
  }
}

