import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; // <-- FIX: Import CommonModule for NgIf and DatePipe

// Core and Shared Imports
import { PatientDto } from '../../../../core/models/Shared/patient.model';
import { ToastService } from '../../../../core/services/toast.service';
import { HeaderPatientInfoComponent } from '../../../../shared/components/header-patient-info/header-patient-info.component';
import { PatientSummaryUiDto } from '../../../../shared/models/patient-summary.ui-dto';

// Feature-specific Imports
import { PatientService } from '../../../Reception/Patients/Services/patient.service';
import { AppointmentsFacade } from '../../services/appointments.facade.service';
import { ScheduleAppointmentRequest } from '../../../Reception/Tickets/models/schedule-appointment.request';
import { TicketService } from '../../../Reception/Tickets/ticket.service';
import { ScheduleAppointmentFormComponent } from '../../components/schedule-appointment-form/schedule-appointment-form.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-schedule-new-appointment',
  standalone: true,
  // --- FIX: Corrected the imports array ---
  imports: [
    CommonModule, // Use CommonModule instead of NgIf and NgModule
    HeaderPatientInfoComponent,
    ScheduleAppointmentFormComponent,
  ],
  templateUrl: './schedule-new-appointment.component.html',
  styleUrl: './schedule-new-appointment.component.css',
})
export class ScheduleNewAppointmentComponent {
  // --- Injected Services & Facades ---
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private patientService = inject(PatientService);
  private toast = inject(ToastService);

  appointmentFacade = inject(AppointmentsFacade);

  patient = signal<PatientDto | null>(null);
  isLoadingPatient = signal(true);

  isLoadingLastDay = computed(() => this.appointmentFacade.isLoadingLastDay());

  lastScheduledDay = computed(() => this.appointmentFacade.lastScheduledDay());

  lastScheduledDayDate = computed(() =>
    ScheduleNewAppointmentComponent.formatToCustomArabicDate(
      this.lastScheduledDay()?.date
    )
  );
  lastScheduledDayDayOfWeek = computed(
    () => this.lastScheduledDay()?.dayOfWeek ?? ''
  );
  lastScheduledDayCount = computed(
    () => this.lastScheduledDay()?.appointmentsCount ?? 0
  );

  ngOnInit(): void {
    this.listenToRouteChanges();
  }
  _ticketId = signal<number | null>(null);
  private listenToRouteChanges() {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const idParam = params.get('ticketId');
        const id = idParam ? Number(idParam) : NaN;
        if (!id || Number.isNaN(id)) {
          this.patient.set(null);
          this.isLoadingPatient.set(false);
          return;
        }
        this._ticketId.set(id);
        this.loadPatientData(3);
        this.appointmentFacade.loadLastScheduledDay();
      });
  }

  private loadPatientData(id: number): void {
    this.isLoadingPatient.set(true);
    this.patientService.getPatientById(id).subscribe((res) => {
      if (res.isSuccess && res.data) {
        this.patient.set(res.data);
      } else {
        this.patient.set(null);
        this.toast.error(res.errorDetail ?? 'Failed to load patient data.');
      }
      this.isLoadingPatient.set(false);
    });
  }

  schedule() {
    this.toast.info('Schedule feature will be here soon');
  }
  isScheduling = signal(false); 
  private ticketService = inject(TicketService); 

  onScheduleSubmit(requestDto: ScheduleAppointmentRequest): void {
    if (this.isScheduling()) return;

    const currentPatient = this.patient();
    if (!currentPatient || !this._ticketId()) {
      this.toast.error('بيانات المريض غير محملة. لا يمكن إنشاء الموعد.');
      return;
    }
    const ticketId = this._ticketId();
    if (!ticketId) {
      this.toast.error(
        'Ticket ID is not available. Cannot create appointment.'
      );
      return;
    }
    this.isScheduling.set(true);

    this.ticketService
      .scheduleAppointment(ticketId, requestDto)
      .pipe(finalize(() => this.isScheduling.set(false)))
      .subscribe((res) => {
        if (res.isSuccess && res.data) {
        
          this.toast.success('تم إنشاء الموعد بنجاح!');
        } else {
          this.toast.error(
            res.errorDetail ?? 'فشل إنشاء الموعد. يرجى المحاولة لاحقاً.'
          );
        }
      });
  }
  private static formatToCustomArabicDate(dateString?: string): string {
    if (!dateString) {
      return '';
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return '';
    }

    const day = date.getDate();
    const year = date.getFullYear();
    const monthIndex = date.getMonth();

    const arabicMonths = [
      'يناير',
      'فبراير',
      'مارس',
      'أبريل',
      'مايو',
      'يونيو',
      'يوليو',
      'أغسطس',
      'سبتمبر',
      'أكتوبر',
      'نوفمبر',
      'ديسمبر',
    ];

    const arabicMonthName = arabicMonths[monthIndex];

    return `${day} من ${arabicMonthName} لعام ${year}`;
  }
}
