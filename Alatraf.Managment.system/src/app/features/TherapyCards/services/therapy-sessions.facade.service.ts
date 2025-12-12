import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';

import { BaseFacade } from '../../../core/utils/facades/base-facade';
import { TherapyDiagnosisService } from '../../Diagnosis/Therapy/Services/therapy-diagnosis.service';

import { TherapyCardDiagnosisDto } from '../../Diagnosis/Therapy/Models/therapy-card-diagnosis.dto';
import { CreateSessionRequest } from '../Models/create-session.request';
import { TherapySessionService } from './therapy-session.service';

@Injectable({
  providedIn: 'root',
})
export class TherapySessionsFacade extends BaseFacade {
  private therapyDiagnosisService = inject(TherapyDiagnosisService);
  private therapySessionService = inject(TherapySessionService);


  private _therapyCard = signal<TherapyCardDiagnosisDto | null>(null);
  therapyCard = this._therapyCard.asReadonly();

  loadingTherapyCard = signal<boolean>(false);

 
  creatingSession = signal<boolean>(false);
  formValidationErrors = signal<Record<string, string[]>>({});

  constructor() {
    super();
  }

  clearState(): void {
    this._therapyCard.set(null);
    this.formValidationErrors.set({});
    this.loadingTherapyCard.set(false);
    this.creatingSession.set(false);
  }


  loadTherapyCardById(therapyCardId: number) {
    this.loadingTherapyCard.set(true);
    this._therapyCard.set(null);
    this.formValidationErrors.set({});

    return this.therapyDiagnosisService.getTherapyCardById(therapyCardId).pipe(
      tap((result) => {
        if (result.isSuccess && result.data) {
          this._therapyCard.set(result.data);
        } else {
          this._therapyCard.set(null);
          this.toast.error(
            result.errorDetail ?? 'لم يتم العثور على بطاقة العلاج'
          );
        }

        this.loadingTherapyCard.set(false);
      })
    );
  }

 
  createSession(
    therapyCardId: number,
    request: CreateSessionRequest
  ) {
    this.creatingSession.set(true);
    this.formValidationErrors.set({});

    return this.therapySessionService
      .createSession(therapyCardId, request)
      .pipe(
        tap((result) => {
          if (result.isSuccess) {
            this.formValidationErrors.set({});
          }

          if (result.validationErrors) {
            this.formValidationErrors.set(result.validationErrors);
          }

          this.creatingSession.set(false);
        })
      );
  }
}
