import { Injectable, inject, signal } from '@angular/core';
import { tap, map, finalize } from 'rxjs/operators';

import { IdentityService } from './identity.service';
import { GetUserFilterRequest } from '../Models/get-user-filter.request';
import { UserListItemDto } from '../Models/Users/user-list-item.dto';
import { ApiResult } from '../../../core/models/ApiResult';
import { PageRequest } from '../../../core/models/Shared/page-request.model';
import { SearchManager } from '../../../core/utils/search-manager';
import { BaseFacade } from '../../../core/utils/facades/base-facade';

@Injectable({ providedIn: 'root' })
export class UsersFacade extends BaseFacade {
  private service = inject(IdentityService);

  private _users = signal<UserListItemDto[]>([]);
  users = this._users.asReadonly();

  private _isLoading = signal<boolean>(false);
  isLoading = this._isLoading.asReadonly();

  totalCount = signal<number>(0);

  private _filters = signal<GetUserFilterRequest>({
    searchBy: '',
    isActive: undefined,
  });
  filters = this._filters.asReadonly();

 
  // Search manager to debounce user searches
  private searchManager = new SearchManager<UserListItemDto[]>(
    (term: string) =>
      this.service.getUsers({ ...this._filters(), searchBy: term }).pipe(
        tap((res) => {
          if (!res.isSuccess) this.handleLoadUsersError(res);
        }),
        map((res) => (res.isSuccess && res.data ? res.data : []))
      ),
    null,
    (items) => {
      this._users.set(items);
      this._isLoading.set(false);
    }
  );

  constructor() {
    super();
  }

 
  private _formValidationErrors = signal<Record<string, string[]>>({});
  formValidationErrors = this._formValidationErrors.asReadonly();

  loadUsers() {
    this._isLoading.set(true);
    this.service
      .getUsers( this._filters())
      .pipe(
        tap((res) => {
          if (res.isSuccess && res.data) {
            this._users.set(res.data);
            this.totalCount.set(Array.isArray(res.data) ? res.data.length : 0);
          } else {
            this._users.set([]);
            this.totalCount.set(0);
            this.handleLoadUsersError(res);
          }

          this._isLoading.set(false);
        })
      )
      .subscribe();
  }


  resetAndLoad(): void {
    this._users.set([]);
    this.totalCount.set(0);
    this.loadUsers();
  }

  search(term: string) {
    this._filters.update((f) => ({ ...f, searchBy: term }));
    this._isLoading.set(true);

    this.searchManager.search(term);
  }

  updateFilters(newFilters: Partial<GetUserFilterRequest>) {
    this._filters.update((f) => ({ ...f, ...newFilters }));
    this.loadUsers();
  }
  setPage(page: number) {
    this.loadUsers();
  }
  setPageSize(size: number) {
    this.loadUsers();
  }
  resetFilters() {
    this._filters.set({ searchBy: '', isActive: undefined });
    this._users.set([]);
    this.totalCount.set(0);
  }

  private handleLoadUsersError(result: ApiResult<any>) {
    const err = this.extractError(result);
    if (err.type === 'validation' || err.type === 'business') {
      this.toast.error(err.message);
      return;
    }

    this.toast.error('تعذر تحميل المستخدمين. يرجى المحاولة لاحقاً.');
  }
}
