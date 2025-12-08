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
    // load first page
    this.ticketFacade.loadTickets();
  }

  onSearch(term: string) {
    this.ticketFacade.search(term);
  }

  // filterByDepartment(departmentId: number | null) {
  //   this.ticketFacade.updateFilters({
  //     departmentId: departmentId ?? undefined,
  //   });

  //   // reset page and reload
  //   this.ticketFacade.setPage(1);
  // }
filterByDepartment(departmentId: number | null) {
  // update active button
  this.activeDepartment.set(departmentId);

  // update filters in facade
  this.ticketFacade.updateFilters({
    departmentId: departmentId ?? undefined,
  });

  // reset to first page & load
  this.ticketFacade.setPage(1);
}

  select(ticket: TicketDto) {
    this.selectedTicket.set(ticket);
    this.navDiagnos.goToTherapyCreate(ticket.patient?.patientId!);
  }

  // expose page data for template (optional)
  pageRequest = this.ticketFacade.pageRequest;
  totalCount = this.ticketFacade.totalCount;
}

