import { Injectable, inject, signal } from '@angular/core';
import { finalize, map, tap } from 'rxjs/operators';

import { IdentityService } from './identity.service';
import { GetUserFilterRequest } from '../Models/get-user-filter.request';
import { UserListItemDto } from '../Models/Users/user-list-item.dto';
import { ApiResult } from '../../../core/models/ApiResult';
import { SearchManager } from '../../../core/utils/search-manager';
import { BaseFacade } from '../../../core/utils/facades/base-facade';
import { CreateUserRequest } from '../Models/create-user.request';
import { RoleDetailsDto } from '../Models/Roles/role-details.dto';
import { PermissionDto } from '../Models/Permissions/permission.dto';
import { UserDetailsDto } from '../../../core/auth/models/user-details.dto.';
import { ActivateUserRequest } from '../Models/activate-user.request';
import { ResetPasswordRequest } from '../Models/reset-password.request';
import { ChangeCredentialsRequest } from '../Models/change-credentials.request';

@Injectable({ providedIn: 'root' })
export class UsersFacadeService extends BaseFacade {
  private service = inject(IdentityService);

  private _users = signal<UserListItemDto[]>([]);
  users = this._users.asReadonly();

  private _selectedUser = signal<UserDetailsDto | null>(null);
  selectedUser = this._selectedUser.asReadonly();

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

  formValidationErrors = signal<Record<string, string[]>>({});

  loadUsers() {
    this._isLoading.set(true);
    this.service
      .getUsers(this._filters())
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
        }),
        finalize(() => this._isLoading.set(false))
      )
      .subscribe();
  }
  private _isLoadingSelectedUser = signal<boolean>(false);
  isLoadingSelectedUser = this._isLoadingSelectedUser.asReadonly();

  getUserById(userId: string) {
    this._isLoadingSelectedUser.set(true);
    this.service
      .getUserById(userId)
      .pipe(
        tap((res) => {
          if (res.isSuccess && res.data) {
            this._selectedUser.set(res.data);
          } else {
            this._selectedUser.set(null);
            this.toast.error(res.errorDetail ?? 'تعذر العثور على المستخدم.');
          }
        }),
        finalize(() => this._isLoadingSelectedUser.set(false))
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

  resetFilters() {
    this._filters.set({ searchBy: '', isActive: undefined });
    this._users.set([]);
    this.totalCount.set(0);
  }

  createUser(dto: CreateUserRequest) {
    return this.handleCreateOrUpdate(this.service.createUser(dto), {
      successMessage: 'تم إنشاء المستخدم بنجاح',
      defaultErrorMessage: 'فشل إنشاء المستخدم. يرجى المحاولة لاحقاً.',
    }).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.formValidationErrors.set({});
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  activateUser(userId: string, dto: ActivateUserRequest) {
    return this.handleCreateOrUpdate(this.service.activateUser(userId, dto), {
      successMessage: 'تم تفعيل المستخدم بنجاح',
      defaultErrorMessage: 'فشل تفعيل المستخدم. يرجى المحاولة لاحقاً.',
    }).pipe(
      tap((res) => {
        if (res.success) {
          this.formValidationErrors.set({});
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  resetPassword(userId: string, dto: ResetPasswordRequest) {
    return this.handleCreateOrUpdate(this.service.resetPassword(userId, dto), {
      successMessage: 'تم إعادة تعيين كلمة المرور بنجاح',
      defaultErrorMessage: 'فشل إعادة تعيين كلمة المرور. يرجى المحاولة لاحقاً.',
    }).pipe(
      tap((res) => {
        if (res.success) {
          this.formValidationErrors.set({});
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  changeCredentials(userId: string, dto: ChangeCredentialsRequest) {
    return this.handleCreateOrUpdate(
      this.service.changeCredentials(userId, dto),
      {
        successMessage: 'تم تحديث بيانات الدخول بنجاح',
        defaultErrorMessage: 'فشل تحديث بيانات الدخول. يرجى المحاولة لاحقاً.',
      }
    ).pipe(
      tap((res) => {
        if (res.success) {
          this.formValidationErrors.set({});
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
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
