import { inject, Injectable, signal } from '@angular/core';

import { BaseFacade } from '../../../../core/utils/facades/base-facade';
import { TherapyCardDiagnosisDto } from '../Models/therapy-card-diagnosis.dto';
import { TherapyDiagnosisService } from './therapy-diagnosis.service';
import { CreateTherapyCardRequest } from '../Models/create-therapy-card.request';
import { UpdateTherapyCardRequest } from '../Models/update-therapy-card.request';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TherapyDiagnosisFacade extends BaseFacade {
  private therapyService = inject(TherapyDiagnosisService);
  private _selectedTherapyCard = signal<TherapyCardDiagnosisDto | null>(null);
  selectedTherapyCard = this._selectedTherapyCard.asReadonly();
  isEditMode = signal<boolean>(false);

  createdTherapyCard = signal<TherapyCardDiagnosisDto | null>(null);

  formValidationErrors = signal<Record<string, string[]>>({});

  constructor() {
    super();
  }
  enterCreateMode() {
    this.isEditMode.set(false);
    this._selectedTherapyCard.set(null);
    this.formValidationErrors.set({});
  }

  loadTherapyCardForEdit(therapyCardId: number) {
    this.isEditMode.set(true);
    this._selectedTherapyCard.set(null);
    this.formValidationErrors.set({});

    this.therapyService
      .getTherapyCardById(therapyCardId)
      .pipe(
        tap((result) => {
          if (result.isSuccess && result.data) {
            this._selectedTherapyCard.set(result.data);
          } else {
            this.toast.error(
              result.errorDetail ?? 'لم يتم العثور على بطاقة العلاج'
            );
            this.isEditMode.set(false);
            this._selectedTherapyCard.set(null);
          }
        })
      )
      .subscribe();
  }

  createTherapyCard(dto: CreateTherapyCardRequest) {
    return this.handleCreateOrUpdate(
      this.therapyService.createTherapyCard(dto),
      {
        successMessage: 'تم حفظ بطاقة العلاج بنجاح',
        defaultErrorMessage: 'فشل حفظ بطاقة العلاج. يرجى المحاولة لاحقاً.',
      }
    ).pipe((tapResult) => {
      tapResult.subscribe((res) => {
        if (res.success && res.data) {
          this.createdTherapyCard.set(res.data);
          this.formValidationErrors.set({});
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      });

      return tapResult;
    });
  }

  updateTherapyCard(therapyCardId: number, dto: UpdateTherapyCardRequest) {
    return this.handleCreateOrUpdate(
      this.therapyService.updateTherapyCard(therapyCardId, dto),
      {
        successMessage: 'تم تعديل بطاقة العلاج بنجاح',
        defaultErrorMessage: 'فشل تعديل بطاقة العلاج. حاول لاحقاً.',
      }
    ).pipe((tapResult) => {
      tapResult.subscribe((res) => {
        if (res.success) {
          // Backend returns void → nothing to store
          this.formValidationErrors.set({});
        }

        if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      });

      return tapResult;
    });
  }
}
