import { NgIf } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PatientDto } from '../../../../../core/models/Shared/patient.model';
import { NavigationReceptionFacade } from '../../../../../core/navigation/navigation-reception.facade';
import { ToastService } from '../../../../../core/services/toast.service';
import { UiLockService } from '../../../../../core/services/ui-lock.service';
import { ServiceSelectComponent } from '../../../../../shared/components/service-select/service-select.component';
import { PatientSummaryCardComponent } from '../../../Patients/components/patient-summary-card/patient-summary-card.component';
import { PatientService } from '../../../Patients/Services/patient.service';
import { CreateTicketRequest } from '../../models/ticket.model';
import { TicketFacade } from '../../tickets.facade.service';
import { TicketService } from '../../ticket.service';

@Component({
  selector: 'app-create-ticket',
  imports: [
    PatientSummaryCardComponent,
    ServiceSelectComponent,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './create-ticket.component.html',
  styleUrl: './create-ticket.component.css',
})
export class CreateTicketComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private navReception = inject(NavigationReceptionFacade);
  private uiLock = inject(UiLockService);
  private toast = inject(ToastService);
  private patientService = inject(PatientService);

  private ticketFacade = inject(TicketFacade); // <-- NEW

  isLoading = signal(true);
  isSaved = false;

  patient!: PatientDto;

  form = this.fb.group({
    serviceId: [null, Validators.required],
  });

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('patientId'));
    this.patientService.getPatientById(id).subscribe((res) => {
      if (res.isSuccess && res.data) {
        this.patient = res.data;
        this.isLoading.set(false);
      }
    });
  }

  onCreateTicket() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaved = true;

    const dto: CreateTicketRequest = {
      patientId: this.patient.patientId,
      serviceId: this.form.value.serviceId!,
    };

    this.ticketFacade.createTicket(dto).subscribe((result) => {
      if (result.success) {
        this.onPrintTicket(result.data!.ticketId); // <-- NEW

        this.onClose();
      } else if (result.validationErrors) {
        this.isSaved = false;
        const errors = result.validationErrors;
        if (errors['serviceId']) {
          this.toast.error(errors['serviceId'][0]);
        }
      } else {
        // Business error handled by facade toast
        this.isSaved = false;
      }
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  onClose() {
    this.uiLock.unlock();
    this.navReception.goToPatientsList();
  }
  ticketService = inject(TicketService);
  onPrintTicket(ticketId: number): void {
    this.ticketService.printTicket(ticketId).subscribe({
      next: (pdfBlob) => {
        const blob = new Blob([pdfBlob], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        // Option 1: Open in new tab
        window.open(url);

       

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Failed to print ticket', err);
      },
    });
  }
}
