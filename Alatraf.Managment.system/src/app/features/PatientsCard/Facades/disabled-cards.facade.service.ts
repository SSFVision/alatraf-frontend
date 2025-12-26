import { Injectable, inject, signal } from '@angular/core';
import { tap, map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

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
  private router = inject(Router);
  private route = inject(ActivatedRoute);

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

  private _isLoading = signal<boolean>(false);
  isLoading = this._isLoading.asReadonly();

  private searchManager = new SearchManager<PatientCardListItemVm[]>(
    (term: string) =>
      this.service
        .getDisabledCards(
          { ...this._filters(), searchTerm: term },
          this._pageRequest()
        )
        .pipe(
          tap((res) => {
            if (!res.isSuccess) {
              this.toast.error('تعذر تحميل كروت ذوي الإعاقة');
            }
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

          this._isLoading.set(false);
        })
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
  private navCard = inject(PatientCardsNavigationFacade);

  openWorkspace(cardId: number): void {
    this.navCard.goToEditDisabledCardPage(cardId);
  }
  openAddPage(): void {
    this.navCard.goToCreateDisabledCardPage();
  }
  private toVm(dto: DisabledCardDto): PatientCardListItemVm {
    return {
      id: dto.disabledCardId,
      cardNumber: dto.cardNumber,
      disabilityType: dto.disabilityType,
      fullName: dto.fullName,
      isExpired: false,
      cardTypeLabel: PatientCardType.Disabled,
    };
  }

  // ---------------------------------------------
  // FORM & EDIT STATE
  // ---------------------------------------------

  private _selectedDisabledCard = signal<DisabledCardDto | null>(null);
  selectedDisabledCard = this._selectedDisabledCard.asReadonly();

  isEditMode = signal<boolean>(false);

  formValidationErrors = signal<Record<string, string[]>>({});
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
  // ---------------------------------------------
  // CREATE
  // ---------------------------------------------
  createDisabledCard(dto: AddDisabledCardRequest) {
    return this.handleCreateOrUpdate(this.service.createDisabledCard(dto), {
      successMessage: 'تم إنشاء كرت ذوي الإعاقة بنجاح',
      defaultErrorMessage: 'فشل إنشاء الكرت. يرجى المحاولة لاحقاً.',
    }).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.formValidationErrors.set({});
          this.addDisabledCardToList(res.data);
          this.enterEditMode(res.data);
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }
  // ---------------------------------------------
  // LOAD FOR EDIT
  // ---------------------------------------------
  loadDisabledCardForEdit(disabledCardId: number): void {
    const localVm = this._items().find((x) => x.id === disabledCardId);
    if (localVm) {
      this.service
        .getDisabledCardByNumber(localVm.cardNumber)
        .pipe(
          tap((res) => {
            if (res.isSuccess && res.data) {
              this.enterEditMode(res.data);
            } else {
              this.toast.error('لم يتم العثور على الكرت');
              this.enterCreateMode();
            }
          })
        )
        .subscribe();
      return;
    }

    this.service
      .getDisabledCardByNumber(String(disabledCardId))
      .pipe(
        tap((res) => {
          if (res.isSuccess && res.data) {
            this.enterEditMode(res.data);
          } else {
            this.toast.error('لم يتم العثور على الكرت');
            this.enterCreateMode();
          }
        })
      )
      .subscribe();
  }
  // ---------------------------------------------
  // UPDATE
  // ---------------------------------------------
  updateDisabledCard(disabledCardId: number, dto: UpdateDisabledCardRequest) {
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
          this.updateDisabledCardInList(disabledCardId, dto);
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  // ---------------------------------------------
  // DELETE
  // ---------------------------------------------
  deleteDisabledCard(card: PatientCardListItemVm): void {
    if (!card?.id) return;

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
    ).subscribe((success) => {
      if (success) {
        this.removeDisabledCardFromList(card.id);
        this.enterCreateMode();
      }
    });
  }

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
