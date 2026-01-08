import { Injectable, inject, signal } from '@angular/core';
import { tap, map, finalize } from 'rxjs/operators';

import { BaseFacade } from '../../../core/utils/facades/base-facade';
import { PageRequest } from '../../../core/models/Shared/page-request.model';
import { SearchManager } from '../../../core/utils/search-manager';
import { PatientCardListItemVm } from '../models/patient-card-list-item.vm';
import { DisabledCardDto } from '../models/disabled-Models/disabled-card.dto';
import { DisabledCardsFilterRequest } from '../models/disabled-Models/disabled-cards-filter.request';
import { DisabledCardsService } from '../services/disabled-cards.service';
import { PatientCardsFacade } from './patient-cards.facade.service';
import { PatientCardType } from '../models/patient-card-type.enum';
import { PatientCardsNavigationFacade } from '../../../core/navigation/patient-cards-navigation.facade';
import { AddDisabledCardRequest } from '../models/disabled-Models/add-disabled-card.request';
import { UpdateDisabledCardRequest } from '../models/disabled-Models/update-disabled-card.request';

@Injectable({ providedIn: 'root' })
export class DisabledCardsFacade
  extends BaseFacade
  implements PatientCardsFacade
{
  private service = inject(DisabledCardsService);
  private navCard = inject(PatientCardsNavigationFacade);

  private _items = signal<PatientCardListItemVm[]>([]);
  items = this._items.asReadonly();

  private _filters = signal<DisabledCardsFilterRequest>({
    searchTerm: '',
    patientId: null,
    sortColumn: 'ExpirationDate',
    sortDirection: 'desc',
  });

  private _pageRequest = signal<PageRequest>({
    page: 1,
    pageSize: 10,
  });
  pageRequest = this._pageRequest.asReadonly();

  totalCount = signal<number>(0);

  private _isLoading = signal<boolean>(false); // list loading
  isLoading = this._isLoading.asReadonly();

  private _loadingItem = signal<boolean>(false);
  loadingItem = this._loadingItem.asReadonly();

  private _saving = signal<boolean>(false);
  saving = this._saving.asReadonly();

  private _selectedDisabledCard = signal<DisabledCardDto | null>(null);
  selectedDisabledCard = this._selectedDisabledCard.asReadonly();

  isEditMode = signal<boolean>(false);
  formValidationErrors = signal<Record<string, string[]>>({});

  private searchManager = new SearchManager<PatientCardListItemVm[]>(
    (term: string) =>
      this.service
        .getDisabledCards(
          { ...this._filters(), searchTerm: term },
          this._pageRequest()
        )
        .pipe(
          tap((res) => {
            if (!res.isSuccess) this.toast.error('تعذر تحميل كروت ذوي الإعاقة');
          }),
          map((res) =>
            res.isSuccess && res.data?.items
              ? res.data.items.map(this.toVm)
              : []
          )
        ),
    null,
    (items) => {
      this._items.set(items);
      this._isLoading.set(false);
    }
  );

  // =========================
  load(): void {
    this._isLoading.set(true);

    this.service
      .getDisabledCards(this._filters(), this._pageRequest())
      .pipe(
        tap((res) => {
          if (res.isSuccess && res.data?.items) {
            this._items.set(res.data.items.map(this.toVm));
            this.totalCount.set(res.data.totalCount ?? 0);
          } else {
            this._items.set([]);
            this.totalCount.set(0);
            this.toast.error('تعذر تحميل كروت ذوي الإعاقة');
          }
        }),
        finalize(() => this._isLoading.set(false))
      )
      .subscribe();
  }

  search(term: string): void {
    this._filters.update((f) => ({ ...f, searchTerm: term }));
    this._pageRequest.update((p) => ({ ...p, page: 1 }));
    this._isLoading.set(true);
    this.searchManager.search(term);
  }

  setPage(page: number): void {
    this._pageRequest.update((p) => ({ ...p, page }));
    this.load();
  }

  setPageSize(size: number): void {
    this._pageRequest.update(() => ({ page: 1, pageSize: size }));
    this.load();
  }

  openWorkspace(cardNumber: string): void {
    this.navCard.goToEditDisabledCardPage(cardNumber);
  }

  openAddPage(): void {
    this.navCard.goToPatientsSelectForDisabledCard();
  }

  // =========================
  // FORM MODE
  // =========================
  enterCreateMode(): void {
    this.isEditMode.set(false);
    this._selectedDisabledCard.set(null);
    this.formValidationErrors.set({});
  }

  enterEditMode(card: DisabledCardDto): void {
    this.isEditMode.set(true);
    this._selectedDisabledCard.set(card);
    this.formValidationErrors.set({});
  }

  // =========================
  // CREATE
  // =========================
  createDisabledCard(dto: AddDisabledCardRequest) {
    this._saving.set(true);

    return this.handleCreateOrUpdate(this.service.createDisabledCard(dto), {
      successMessage: 'تم إنشاء كرت ذوي الإعاقة بنجاح',
      defaultErrorMessage: 'فشل إنشاء الكرت. يرجى المحاولة لاحقاً.',
    })
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            this.formValidationErrors.set({});

            this.addDisabledCardToList(res.data);

            this.enterEditMode(res.data);

            this.navCard.goToEditDisabledCardPage(res.data.cardNumber);
          } else if (res.validationErrors) {
            this.formValidationErrors.set(res.validationErrors);
          }
        }),
        finalize(() => this._saving.set(false))
      )
      .subscribe();
  }

 
  loadDisabledCardForEdit(cardNumber: string): void {
    this._loadingItem.set(true);
    this.isEditMode.set(true);
    this._selectedDisabledCard.set(null);

    this.service
      .getDisabledCardByNumber(cardNumber)
      .pipe(
        tap((res) => {
          if (res.isSuccess && res.data) {
            this.enterEditMode(res.data);
          } else {
            this.toast.error('لم يتم العثور على الكرت');
            this.enterCreateMode();
          }
        }),
        finalize(() => this._loadingItem.set(false))
      )
      .subscribe();
  }

  // =========================
  // UPDATE
  // =========================
  updateDisabledCard(disabledCardId: number, dto: UpdateDisabledCardRequest) {
    this._saving.set(true);

    return this.handleCreateOrUpdate(
      this.service.updateDisabledCard(disabledCardId, dto),
      {
        successMessage: 'تم تعديل كرت ذوي الإعاقة بنجاح',
        defaultErrorMessage: 'فشل تعديل الكرت. حاول لاحقاً.',
      }
    ).pipe(
      tap((res) => {
        if (res.success) {
          this.formValidationErrors.set({});
          this.load();
          // this.updateDisabledCardInList(disabledCardId, dto);
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      }),
      finalize(() => this._saving.set(false))
    );
  }

  // =========================
  // DELETE
  // =========================
  private _isConfirmingDelete = signal(false);

  deleteDisabledCard(card: PatientCardListItemVm): void {
    if (!card?.id) return;
    if (this._isConfirmingDelete()) return; // ⛔ prevent re-entry

    this._isConfirmingDelete.set(true);

    const config = {
      title: 'حذف كرت ذوي الإعاقة',
      message: 'هل أنت متأكد من حذف كرت ذوي الإعاقة التالي؟',
      payload: {
        'رقم الكرت': card.cardNumber,
        الاسم: card.fullName,
      },
    };

    this.confirmAndDelete(
      config,
      () => this.service.deleteDisabledCard(card.id),
      {
        successMessage: 'تم حذف الكرت بنجاح',
        defaultErrorMessage: 'فشل حذف الكرت. حاول لاحقاً.',
      }
    ).subscribe(() => {
      this._isConfirmingDelete.set(false); // ✅ reset after close
    });
  }

  // =========================
  // MAPPERS + LOCAL MUTATIONS
  // =========================
  private toVm = (dto: DisabledCardDto): PatientCardListItemVm => {
    return {
      id: dto.disabledCardId,
      cardNumber: dto.cardNumber,
      disabilityType: dto.disabilityType,
      fullName: dto.fullName,
      isExpired: false,
      cardTypeLabel: PatientCardType.Disabled,
    };
  };

  private addDisabledCardToList(card: DisabledCardDto): void {
    this._items.update((list) => [this.toVm(card), ...list]);
    this.totalCount.update((c) => c + 1);
  }

  private updateDisabledCardInList(
    id: number,
    dto: UpdateDisabledCardRequest
  ): void {
    this._items.update((list) =>
      list.map((item) =>
        item.id === id
          ? {
              ...item,
              cardNumber: dto.cardNumber,
              disabilityType: dto.disabilityType,
            }
          : item
      )
    );

    const selected = this._selectedDisabledCard();
    if (selected?.disabledCardId === id) {
      this._selectedDisabledCard.set({
        ...selected,
        cardNumber: dto.cardNumber,
        disabilityType: dto.disabilityType,
        issueDate: dto.issueDate,
        cardImagePath: dto.cardImagePath ?? null,
      });
    }
  }

  private removeDisabledCardFromList(id: number): void {
    this._items.update((list) => list.filter((x) => x.id !== id));
    this.totalCount.update((c) => Math.max(0, c - 1));
  }
}
