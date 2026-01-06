import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AppointmentsFacade } from '../../services/appointments.facade.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { AppointmentStatus } from '../../Models/appointment-status.enum';
import { finalize } from 'rxjs';
import { getAppointmentStatusLabelFromEnumToArabic } from '../../utils/appointment-utils';

@Component({
  selector: 'app-change-appointment-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './change-appointment-status.component.html',
  styleUrls: ['./change-appointment-status.component.css'],
})
export class ChangeAppointmentStatusComponent implements OnInit {
  appointmentFacade = inject(AppointmentsFacade);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  readonly AppointmentStatus = AppointmentStatus;
  readonly flow = [
    AppointmentStatus.Scheduled,
    AppointmentStatus.Today,
    AppointmentStatus.Attended,
    AppointmentStatus.Absent,
    AppointmentStatus.Cancelled,
  ];

  selectedAppointment = this.appointmentFacade.selectedAppointment;
  actionLoading = signal<boolean>(false);
  private currentAppointmentId: number | null = null;

  ngOnInit(): void {
    this.listenToRouteChanges();
  }

  private listenToRouteChanges() {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const idParam = params.get('appointmentId');

        const appointmentId = idParam ? Number(idParam) : NaN;
        if (!appointmentId || Number.isNaN(appointmentId)) {
          return;
        }
        this.currentAppointmentId = appointmentId;
        this.appointmentFacade.getAppointmentById(appointmentId).subscribe();
      });
  }

  changeStatus(newStatus: AppointmentStatus) {
    const id = this.currentAppointmentId;
    const current = this.selectedAppointment();
    if (!id || this.actionLoading() || !current) return;
    if (current.status === newStatus) return;
    if (this.isOptionDisabled(newStatus)) return;

    this.actionLoading.set(true);
    this.appointmentFacade
      .changeAppointmentStatus(id, { status: newStatus })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.actionLoading.set(false))
      )
      .subscribe();
  }

  statusLabel(status: AppointmentStatus | undefined): string {
    if (status === undefined) return '';
  return getAppointmentStatusLabelFromEnumToArabic(status);
  }

  isOptionDisabled(target: AppointmentStatus) {
    const current = this.selectedAppointment();
    if (!current) return true;

    if (target === AppointmentStatus.Today) {
      return current.status !== AppointmentStatus.Scheduled;
    }

    if (target === AppointmentStatus.Attended) {
      return current.status !== AppointmentStatus.Today;
    }

    if (target === AppointmentStatus.Absent) {
      return current.status !== AppointmentStatus.Today;
    }

    if (target === AppointmentStatus.Cancelled) {
      return (
        current.status === AppointmentStatus.Attended ||
        current.status === AppointmentStatus.Cancelled
      );
    }

    return true;
  }
}
