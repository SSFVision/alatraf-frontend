import { Component, inject, OnInit, signal } from '@angular/core';
import { PatientSummaryCardComponent } from '../../../Patients/components/patient-summary-card/patient-summary-card.component';
import { ServiceSelectComponent } from '../../../../../shared/components/service-select/service-select.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../../../Patients/Services/patient.service';
import { CreateTicketDto } from '../../models/create-ticket.dto';
import { TicketService } from '../../ticket.service';
import { NgIf } from '@angular/common';
import { Patient } from '../../../Patients/models/patient.model';
import { ToastService } from '../../../../../core/services/toast.service';
import { NavigationReceptionFacade } from '../../../../../core/navigation/navigation-reception.facade';
import { UiLockService } from '../../../../../core/services/ui-lock.service';

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
  isLoading = signal(true);

  private toast = inject(ToastService);
  patientService = inject(PatientService);
  ticketService = inject(TicketService);

  patient!: Patient;
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
  isSaved = false;
  onCreateTicket() {
    if (this.form.valid) {
      this.isSaved = true;
      const dto: CreateTicketDto = {
        patientId: this.patient.patientId,
        serviceId: this.form.value.serviceId!,
      };

      this.ticketService.createTicket(dto).subscribe((res) => {
        if (res.isSuccess && res.data) {
          this.toast.success('لقد قمت بإنشاء التذكرة بنجاح');
          this.onClose();
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && control.touched);
  }
  onClose() {
    this.uiLock.unlock();
    this.navReception.goToPatientsList();
  }
}
