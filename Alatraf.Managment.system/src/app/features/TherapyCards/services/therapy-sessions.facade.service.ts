import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';

import { BaseFacade } from '../../../core/utils/facades/base-facade';
import { TherapyDiagnosisService } from '../../Diagnosis/Therapy/Services/therapy-diagnosis.service';
import { TherapySessionService } from './therapy-session.service';

import { TherapyCardDiagnosisDto } from '../../Diagnosis/Therapy/Models/therapy-card-diagnosis.dto';
import { CreateSessionRequest } from '../Models/create-session.request';
import { SessionDto } from '../Models/session.dto';

@Injectable({
  providedIn: 'root',
})
export class TherapySessionsFacade extends BaseFacade {
  private therapyDiagnosisService = inject(TherapyDiagnosisService);
  private therapySessionService = inject(TherapySessionService);

  // ------------------------------------------------------------------
  // State
  // ------------------------------------------------------------------
  private _therapyCard = signal<TherapyCardDiagnosisDto | null>(null);
  therapyCard = this._therapyCard.asReadonly();

  loadingTherapyCard = signal<boolean>(false);
  creatingSession = signal<boolean>(false);
sessionCreated = signal<boolean>(false);

  formValidationErrors = signal<Record<string, string[]>>({});

  // ------------------------------------------------------------------
  // Reset
  // ------------------------------------------------------------------
  clearState(): void {
    this._therapyCard.set(null);
    this.formValidationErrors.set({});
    this.loadingTherapyCard.set(false);
    this.creatingSession.set(false);
  }

  // ------------------------------------------------------------------
  // Load therapy card (read-only → no BaseFacade wrapper needed)
  // ------------------------------------------------------------------
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

  // ------------------------------------------------------------------
  // Create session (write → use BaseFacade)
  // ------------------------------------------------------------------
 createSession(
  therapyCardId: number,
  request: CreateSessionRequest
) {
  this.creatingSession.set(true);
  this.formValidationErrors.set({});
  this.sessionCreated.set(false);

  return this.handleCreateOrUpdate(
    this.therapySessionService.createSession(therapyCardId, request),
    {
      successMessage: 'تم إنشاء الجلسة بنجاح',
      defaultErrorMessage: 'فشل إنشاء الجلسة، حاول مرة أخرى',
    }
  ).pipe(
    tap((res) => {
      if (res.success) {
        this.sessionCreated.set(true);
      }

      if (res.validationErrors) {
        this.formValidationErrors.set(res.validationErrors);
      }

      this.creatingSession.set(false);
    })
  );
}

sessions = signal<SessionDto[]>([]);
loadingSessions = signal<boolean>(false);
loadSessionsByTherapyCardId(therapyCardId: number) {
  this.loadingSessions.set(true);
  this.sessions.set([]);

  return this.therapySessionService
    .getAllSessionsByTherapyCardId(therapyCardId)
    .pipe(
      tap((result) => {
        if (result.isSuccess && result.data) {
          this.toast.success("sucess loading all session ")
          this.sessions.set(result.data);
        } else {
          this.sessions.set([]);
          this.toast.error(
            result.errorDetail ?? 'تعذر تحميل جلسات بطاقة العلاج'
          );
        }

        this.loadingSessions.set(false);
      })
    );
}


}
