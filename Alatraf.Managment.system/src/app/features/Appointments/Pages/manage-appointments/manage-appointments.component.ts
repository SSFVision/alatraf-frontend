import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppointmentStatus } from '../../Models/appointment-status.enum';
import { AppointmentsFacade } from '../../services/appointments.facade.service';
import { WaitingAppointmentCardComponent } from '../../Shared/waiting-appointment-card/waiting-appointment-card.component';
import { AppointmentsNavigationFacade } from '../../../../core/navigation/Appointments-navigation.facade';
import { signal } from '@angular/core';

@Component({
  selector: 'app-manage-appointments',
  imports: [RouterOutlet, WaitingAppointmentCardComponent],
  templateUrl: './manage-appointments.component.html',
  styleUrls: ['./manage-appointments.component.css'],
})
export class ManageAppointmentsComponent {
  appointmentFacade = inject(AppointmentsFacade);
  appointments = this.appointmentFacade.appointments;
  isloading = this.appointmentFacade.isLoading;
  pageRequest = this.appointmentFacade.pageRequest;
  totalCount = this.appointmentFacade.totalCount;
  private nav = inject(AppointmentsNavigationFacade);

  ngOnInit() {
    this.appointmentFacade.updateFilters({ status: undefined });
  }

  ngOnDestroy() {
    this.appointmentFacade.resetFilters();
  }

  onSearch(term: string) {
    this.appointmentFacade.search(term);
  }

  AppointmentStatus = AppointmentStatus;

  selectedFilter = signal<undefined | AppointmentStatus>(undefined);

  setFilter(status: AppointmentStatus | undefined) {
    this.selectedFilter.set(status);
    this.appointmentFacade.updateFilters({ status });
  }

  onSelectAppointment(appointment: any) {
    // this.isButtonVisible.set(true);
    this.nav.goToChangeAppointmentStatus(appointment.id);
  }

  // onCheckIn(appointmentId: number) {
  //   // this.appointmentFacade
  //   //   .changeAppointmentStatus(appointmentId, {
  //   //     status: AppointmentStatus.Attended,
  //   //   })
  //   //   .subscribe();
  // }
  onAddHoliday() {
    this.nav.goToAddNewHolidayPage();
  }
}
