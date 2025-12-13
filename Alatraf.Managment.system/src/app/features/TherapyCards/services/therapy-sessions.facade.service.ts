import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';

import { BaseFacade } from '../../../core/utils/facades/base-facade';
import { TherapyDiagnosisService } from '../../Diagnosis/Therapy/Services/therapy-diagnosis.service';
import { TherapySessionService } from './therapy-session.service';

import { TherapyCardDiagnosisDto } from '../../Diagnosis/Therapy/Models/therapy-card-diagnosis.dto';
import { CreateSessionRequest } from '../Models/create-session.request';
import { SessionDto } from '../Models/session.dto';
import { PageRequest } from '../../../core/models/Shared/page-request.model';
import { GetPaidTherapyCardsFilterRequest } from '../Models/get-paid-therapy-cards-filter.request';

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
  createSession(therapyCardId: number, request: CreateSessionRequest) {
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
            this.toast.success('sucess loading all session ');
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

  // ----------------------- Paid Therapy Cards -----------------------
  private _paidTherapyCards = signal<TherapyCardDiagnosisDto[]>([]);
  paidTherapyCards = this._paidTherapyCards.asReadonly();

  private _paidFilters = signal<GetPaidTherapyCardsFilterRequest>({
    searchTerm: '',
    sortColumn: 'PaymentDate',
    sortDirection: 'asc',
  });
  paidFilters = this._paidFilters.asReadonly();

  private _paidPageRequest = signal<PageRequest>({
    page: 1,
    pageSize: 20,
  });
  paidPageRequest = this._paidPageRequest.asReadonly();

  paidTotalCount = signal<number>(0);
  loadingPaidTherapyCards = signal<boolean>(false);
  loadPaidTherapyCards() {
    this.loadingPaidTherapyCards.set(true);

    this.therapySessionService
      .getPaidTherapyCards(this._paidFilters(), this._paidPageRequest())
      .pipe(
        tap((result) => {
          if (result.isSuccess && result.data?.items) {
            this._paidTherapyCards.set(result.data.items);
            this.paidTotalCount.set(result.data.totalCount ?? 0);
          } else {
            this._paidTherapyCards.set([]);
            this.paidTotalCount.set(0);
            this.toast.error('تعذر تحميل قائمة المرضى المدفوعين');
          }

          this.loadingPaidTherapyCards.set(false);
        })
      );
  }
  updatePaidFilters(newFilters: Partial<GetPaidTherapyCardsFilterRequest>) {
    this._paidFilters.update((f) => ({ ...f, ...newFilters }));
  }
  setPaidPage(page: number) {
    this._paidPageRequest.update((p) => ({ ...p, page }));
    this.loadPaidTherapyCards();
  }

  setPaidPageSize(size: number) {
    this._paidPageRequest.update(() => ({
      page: 1,
      pageSize: size,
    }));
    this.loadPaidTherapyCards();
  }
  resetPaidFilters() {
    this._paidFilters.set({
      searchTerm: '',
      sortColumn: 'PaymentDate',
      sortDirection: 'asc',
    });

    this._paidPageRequest.set({
      page: 1,
      pageSize: 20,
    });

    this._paidTherapyCards.set([]);
    this.paidTotalCount.set(0);
  }
}
