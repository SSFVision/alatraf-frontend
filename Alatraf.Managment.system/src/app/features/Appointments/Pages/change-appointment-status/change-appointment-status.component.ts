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
  AppStatus = AppointmentStatus;

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
    if (!this.canTransitionTo(newStatus)) return;

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

  canTransitionTo(newState: AppointmentStatus): boolean {
    const current = this.selectedAppointment();
    if (!current) return false;

    // Business rules:
    // Scheduled -> Today
    if (
      current.status === AppointmentStatus.Scheduled &&
      newState === AppointmentStatus.Today
    )
      return true;

    // Today -> Attended
    if (
      current.status === AppointmentStatus.Today &&
      newState === AppointmentStatus.Attended
    )
      return true;

    // Today -> Absent
    if (
      current.status === AppointmentStatus.Today &&
      newState === AppointmentStatus.Absent
    )
      return true;

    // Any (except Attended) -> Cancelled
    if (
      newState === AppointmentStatus.Cancelled &&
      current.status !== AppointmentStatus.Attended
    )
      return true;

    return false;
  }

  isOptionDisabled(target: AppointmentStatus) {
    return !this.canTransitionTo(target);
  }
}
