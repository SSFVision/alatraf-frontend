import { Signal } from '@angular/core';
import { PageRequest } from '../../../core/models/Shared/page-request.model';
import { PatientCardListItemVm } from '../models/patient-card-list-item.vm';

export interface PatientCardsFacade {
  // -----------------------------
  // STATE
  // -----------------------------
  items: Signal<PatientCardListItemVm[]>;
  isLoading: Signal<boolean>;
  totalCount: Signal<number>;
  pageRequest: Signal<PageRequest>;

  // -----------------------------
  // ACTIONS
  // -----------------------------
  load(): void;
  search(term: string): void;
  setPage(page: number): void;
  setPageSize(size: number): void;

  openWorkspace(cardNumber: string): void;
  openAddPage():void;
}
