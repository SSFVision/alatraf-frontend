import {
  Component,
  DestroyRef,
  EnvironmentInjector,
  OnInit,
  effect,
  inject,
  runInInjectionContext,
  signal,
  ViewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HeaderPatientInfoComponent } from '../../../../../shared/components/header-patient-info/header-patient-info.component';
import { AddTherapyDiagnosisFormComponent } from '../../Components/add-therapy-diagnosis-form/add-therapy-diagnosis-form.component';
import { ToastService } from '../../../../../core/services/toast.service';
import { CreateTherapyCardRequest } from '../../Models/create-therapy-card.request';
import { TherapyDiagnosisFacade } from '../../Services/therapy-diagnosis.facade.Service';
import { UpdateTherapyCardRequest } from '../../Models/update-therapy-card.request';
import { TicketFacade } from '../../../../Reception/Tickets/tickets.facade.service';
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

  ticket = this.ticketFacade.selectedTicket;
  viewMode = signal<'add' | 'history'>('add');

  isLoading = this.ticketFacade.loadingTicket;

  injuryReasons = this.therapyFacade.injuryReasons;
  injurySides = this.therapyFacade.injurySides;
  injuryTypes = this.therapyFacade.injuryTypes;
  medicalPrograms = this.therapyFacade.medicalPrograms;
  isLookupLoading = this.therapyFacade.loadingLookups;

  isEditMode = this.therapyFacade.isEditMode;
  existingCard = signal<TherapyCardDiagnosisDto | null>(null);
  patientTherapyDiagnoisis = this.therapyFacade.patientTherapyDiagnoisis;
  loadingpatientTherapyDiagnoisis =
    this.therapyFacade.loadingPatientTherapyDiagnoisis;

  @ViewChild(AddTherapyDiagnosisFormComponent)
  private formComp?: AddTherapyDiagnosisFormComponent;

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
    this.isEditMode.set(false);
    this.viewMode.set('history');
  }

  onViewCard(patientDiagnosis: TherapyCardDiagnosisDto) {
    this.existingCard.set(patientDiagnosis);
    console.log('TherapyCardDiagnosisDto:', patientDiagnosis);
    this.isEditMode.set(true);
    this.viewMode.set('add');
  }

  saveTherapyDiagnosis(
    dto: CreateTherapyCardRequest | UpdateTherapyCardRequest
  ) {
    // disable form to prevent duplicate submits
    this.formComp?.startSubmitting();

    if (this.isEditMode() && this.existingCard() !== null) {
      this.therapyFacade
        .updateTherapyCard(
          this.existingCard()!.therapyCardId,
          dto as UpdateTherapyCardRequest
        )
        .subscribe((result) => {
          if (result.validationErrors) {
            this.therapyFacade.formValidationErrors.set(
              result.validationErrors
            );
            // re-enable form so user can correct
            this.formComp?.stopSubmitting();
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
            // re-enable form so user can correct
            this.formComp?.stopSubmitting();
          }
          // on success we keep form disabled to prevent further edits
        });
    }
  }
}
