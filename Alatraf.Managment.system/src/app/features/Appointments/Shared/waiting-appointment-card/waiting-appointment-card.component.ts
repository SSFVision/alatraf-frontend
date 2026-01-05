import { AppointmentStatus } from './../../Models/appointment-status.enum';
import { ChangeAppointmentStatusRequest } from './../../Models/change-appointment-status.request';
import { DatePipe } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { AppointmentDto } from '../../Models/appointment.dto';
import { getAppointmentStatusLabelFromEnumToArabic } from '../../utils/appointment-utils';

@Component({
  selector: 'app-waiting-appointment-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './waiting-appointment-card.component.html',
  styleUrl: './waiting-appointment-card.component.css',
})
export class WaitingAppointmentCardComponent {
  appointments = input<AppointmentDto[]>([]);
  loading = input<boolean>(false);

  select = output<AppointmentDto>();

  selectedId = signal<number | null>(null);
  appointmentsStatus = AppointmentStatus;

  ChangeAppointmentStatusToArabic(
    appointmentStatus: AppointmentStatus | number | string
  ): string {
    return getAppointmentStatusLabelFromEnumToArabic(appointmentStatus);
  }
  onSelect(appointment: AppointmentDto) {
    this.selectedId.set(appointment.id);
    this.select.emit(appointment);
  }
}
