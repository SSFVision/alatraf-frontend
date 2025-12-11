import {
  Component,
  DestroyRef,
  EnvironmentInjector,
  OnInit,
  effect,
  inject,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HeaderPatientInfoComponent } from '../../../Shared/Components/header-patient-info/header-patient-info.component';
import { AddTherapyDiagnosisFormComponent } from '../../Components/add-therapy-diagnosis-form/add-therapy-diagnosis-form.component';
import { ToastService } from '../../../../../core/services/toast.service';
import { CreateTherapyCardRequest } from '../../Models/create-therapy-card.request';
import { TherapyDiagnosisFacade } from '../../Services/therapy-diagnosis.facade.Service';
import { UpdateTherapyCardRequest } from '../../Models/update-therapy-card.request';
import { TicketFacade } from '../../../../Reception/Tickets/tickets.facade.service';
import { TherapyCardDto } from '../../Models/therapy-card.dto';
import { PreviousTherapyCardDiagnosisComponent } from '../../Components/previous-therapy-card-diagnosis/previous-therapy-card-diagnosis.component';
import { TherapyCardDiagnosisDto } from '../../Models/therapy-card-diagnosis.dto';

@Component({
  selector: 'app-therapy-diagnosis-workspace',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HeaderPatientInfoComponent,
    AddTherapyDiagnosisFormComponent,
    PreviousTherapyCardDiagnosisComponent,
  ],
  templateUrl: './therapy-diagnosis-workspace.component.html',
  styleUrls: ['./therapy-diagnosis-workspace.component.css'],
})
export class TherapyDiagnosisWorkspaceComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  private toast = inject(ToastService);
  private therapyFacade = inject(TherapyDiagnosisFacade);
  private ticketFacade = inject(TicketFacade);
  private env = inject(EnvironmentInjector);

  ticket = this.ticketFacade.selectedTicket;
  viewMode = signal<'add' | 'history'>('add');

  isLoading = this.ticketFacade.loadingTicket;

  // Lookup Signals (from therapy facade)
  injuryReasons = this.therapyFacade.injuryReasons;
  injurySides = this.therapyFacade.injurySides;
  injuryTypes = this.therapyFacade.injuryTypes;
  medicalPrograms = this.therapyFacade.medicalPrograms;
  isLookupLoading = this.therapyFacade.loadingLookups;

  isEditMode = this.therapyFacade.isEditMode;
  existingCard = signal<any | null>(null);
  patientTherapyDiagnoisis = this.therapyFacade.patientTherapyDiagnoisis;
  loadingpatientTherapyDiagnoisis =
    this.therapyFacade.loadingPatientTherapyDiagnoisis;

  ngOnInit(): void {
    this.therapyFacade.loadLookups();
    this.listenToRouteChanges();
  }
  constructor() {
    effect(() => {
      const mode = this.viewMode();
      const patientId = this.ticket()?.patient?.patientId;

      if (mode === 'history' && patientId) {
        this.therapyFacade.loadPatientTherapyDiagnoisis(patientId);
      }
    });
  }

  private listenToRouteChanges() {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const ticketId = Number(params.get('ticketId'));
        if (!ticketId || Number.isNaN(ticketId)) {
          this.isLoading.set(false);
          return;
        }
        this.ticketFacade.loadTicketById(ticketId);
      });
  }

  switchToAdd() {
    this.viewMode.set('add');
    this.therapyFacade.enterCreateMode();
  }

  switchToHistory() {
    this.viewMode.set('history');
  }
  onViewCard(patientDiagnosis: TherapyCardDiagnosisDto) {
    console.log('TherapyCardDiagnosisDto:', patientDiagnosis);
  }

  saveTherapyDiagnosis(
    dto: CreateTherapyCardRequest | UpdateTherapyCardRequest
  ) {
    if (this.isEditMode()) {
      this.therapyFacade
        .updateTherapyCard(
          this.existingCard()?.TherapyCardId,
          dto as UpdateTherapyCardRequest
        )
        .subscribe((result) => {
          if (result.validationErrors) {
            this.therapyFacade.formValidationErrors.set(
              result.validationErrors
            );
          }
        });
    } else {
      this.therapyFacade
        .createTherapyCard(dto as CreateTherapyCardRequest)
        .subscribe((result) => {
          if (result.validationErrors) {
            this.therapyFacade.formValidationErrors.set(
              result.validationErrors
            );
          }
        });
    }
  }
}
