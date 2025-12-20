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
    isExpired: null,
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

  private toVm(dto: DisabledCardDto): PatientCardListItemVm {
    return {
      id: dto.disabledCardId,
      cardNumber: dto.cardNumber,
      expirationDate: dto.expirationDate,
      fullName: dto.fullName,
      isExpired: dto.isExpired,
      cardTypeLabel: PatientCardType.Disabled,
    };
  }
}
