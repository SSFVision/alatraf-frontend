import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppointmentStatus } from '../../Models/appointment-status.enum';
import { AppointmentsFacade } from '../../services/appointments.facade.service';
import { WaitingAppointmentCardComponent } from '../../Shared/waiting-appointment-card/waiting-appointment-card.component';

@Component({
  selector: 'app-manage-appointments',
  imports: [RouterOutlet, WaitingAppointmentCardComponent],
  templateUrl: './manage-appointments.component.html',
})
export class ManageAppointmentsComponent {
  appointmentFacade = inject(AppointmentsFacade);
  appointments = this.appointmentFacade.appointments;
  isloading = this.appointmentFacade.isLoading;
  pageRequest = this.appointmentFacade.pageRequest;
  totalCount = this.appointmentFacade.totalCount;

  ngOnInit() {
    this.appointmentFacade.updateFilters({
      // status: AppointmentStatus.Scheduled,
    });
  }

  ngOnDestroy() {
    this.appointmentFacade.resetFilters();
  }

  onSearch(term: string) {
    this.appointmentFacade.search(term);
  }

  onSelectAppointment(appointment: any) {
    console.log('select appointment', appointment);
  }

  // onCheckIn(appointmentId: number) {
  //   // this.appointmentFacade
  //   //   .changeAppointmentStatus(appointmentId, {
  //   //     status: AppointmentStatus.Attended,
  //   //   })
  //   //   .subscribe();
  // }
  onAddHoliday() {
    console.log('Add holiday clicked');
  }
}
