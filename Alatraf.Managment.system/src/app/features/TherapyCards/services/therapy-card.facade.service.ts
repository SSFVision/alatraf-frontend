import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';

import { BaseFacade } from '../../../core/utils/facades/base-facade';
import { RenewTherapyCardRequest } from '../Models/renew-therapy-card.request';
import { TherapyCardDto } from '../Models/therapy-card.dto';
import { TherapyCardService } from './therapy-card.service';

@Injectable({
  providedIn: 'root',
})
export class TherapyCardFacade extends BaseFacade {
  private therapyCardService = inject(TherapyCardService);

  private _therapyCard = signal<TherapyCardDto | null>(null);
  therapyCard = this._therapyCard.asReadonly();

  loadingCard = signal<boolean>(false);
  renewingCard = signal<boolean>(false);

  formValidationErrors = signal<Record<string, string[]>>({});

  constructor() {
    super();
  }

  clearState(): void {
    this._therapyCard.set(null);
    this.formValidationErrors.set({});
    this.loadingCard.set(false);
    this.renewingCard.set(false);
  }

  loadTherapyCardByIdWithSessions(therapyCardId: number) {
    this.loadingCard.set(true);
    this._therapyCard.set(null);
    this.formValidationErrors.set({});

    return this.therapyCardService
      .getTherapyCardByIdWithSessions(therapyCardId)
      .pipe(
        tap((result) => {
          if (result.isSuccess && result.data) {
            this._therapyCard.set(result.data);
          } else {
            this._therapyCard.set(null);
            this.toast.error(
              result.errorDetail ?? 'لم يتم العثور على بطاقة العلاج'
            );
          }

          this.loadingCard.set(false);
        })
      );
  }

  renewTherapyCard(therapyCardId: number, request: RenewTherapyCardRequest) {
    this.renewingCard.set(true);
    this.formValidationErrors.set({});

    return this.therapyCardService
      .renewTherapyCard(therapyCardId, request)
      .pipe(
        tap((result) => {
          if (result.isSuccess && result.data) {
            this._therapyCard.set(result.data);
            this.formValidationErrors.set({});
          }

          if (result.validationErrors) {
            this.formValidationErrors.set(result.validationErrors);
          }

          this.renewingCard.set(false);
        })
      );
  }
}
