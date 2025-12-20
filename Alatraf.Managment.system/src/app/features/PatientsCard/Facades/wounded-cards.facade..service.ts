import { Injectable, inject, signal } from '@angular/core';
import { tap, map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseFacade } from '../../../core/utils/facades/base-facade';
import { PageRequest } from '../../../core/models/Shared/page-request.model';
import { SearchManager } from '../../../core/utils/search-manager';
import { PatientCardListItemVm } from '../models/patient-card-list-item.vm';
import { PatientCardsFacade } from './patient-cards.facade.service';
import { WoundedCardDto } from '../models/Wounded-models/wounded-card.dto';
import { WoundedCardsFilterRequest } from '../models/Wounded-models/wounded-cards-filter.request';
import { WoundedCardsService } from '../services/wounded-cards.service';
import { PatientCardsNavigationFacade } from '../../../core/navigation/patient-cards-navigation.facade';
import { PatientCardType } from '../models/patient-card-type.enum';

@Injectable({ providedIn: 'root' })
export class WoundedCardsFacade
  extends BaseFacade
  implements PatientCardsFacade
{
  private service = inject(WoundedCardsService);
  private navCard = inject(PatientCardsNavigationFacade);

  // ---------------------------------------------
  // LIST STATE
  // ---------------------------------------------
  private _items = signal<PatientCardListItemVm[]>([]);
  items = this._items.asReadonly();

  private _filters = signal<WoundedCardsFilterRequest>({
    searchTerm: '',
    isExpired: null,
    patientId: null,
    sortColumn: 'Expiration',
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

  // ---------------------------------------------
  // SEARCH MANAGER
  // ---------------------------------------------
  private searchManager = new SearchManager<PatientCardListItemVm[]>(
    (term: string) =>
      this.service
        .getWoundedCards(
          { ...this._filters(), searchTerm: term },
          this._pageRequest()
        )
        .pipe(
          tap((res) => {
            if (!res.isSuccess) {
              this.toast.error('تعذر تحميل كروت الجرحى');
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

  // ---------------------------------------------
  // ACTIONS
  // ---------------------------------------------
  load(): void {
    this._isLoading.set(true);

    this.service
      .getWoundedCards(this._filters(), this._pageRequest())
      .pipe(
        tap((res) => {
          if (res.isSuccess && res.data?.items) {
            this._items.set(res.data.items.map(this.toVm));
            this.totalCount.set(res.data.totalCount ?? 0);
          } else {
            this._items.set([]);
            this.totalCount.set(0);
            this.toast.error('تعذر تحميل كروت الجرحى');
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

  openWorkspace(cardId: number): void {
   this.navCard.goToEditWoundedCardPage(cardId)
  }

  // ---------------------------------------------
  // MAPPERS
  // ---------------------------------------------
  private toVm(dto: WoundedCardDto): PatientCardListItemVm {
    return {
      id: dto.woundedCardId,
      cardNumber: dto.cardNumber,
      expirationDate: dto.expirationDate,
      fullName: dto.fullName,
      isExpired: dto.isExpired,
          cardTypeLabel: PatientCardType.Wounded,

    };
  }
}
