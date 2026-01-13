import { Injectable, inject, signal } from '@angular/core';
import { finalize, tap } from 'rxjs/operators';

import { ApiResult } from '../../../core/models/ApiResult';
import { BaseFacade } from '../../../core/utils/facades/base-facade';
import { IdentityService } from './identity.service';
import { AssignRolesRequest } from '../Models/assign-roles.request';
import { PermissionIdsRequest } from '../Models/permission-ids.request';
import { RoleDetailsDto } from '../Models/Roles/role-details.dto';
import { PermissionDto } from '../Models/Permissions/permission.dto';

@Injectable({ providedIn: 'root' })
export class RolesAndPermissionsFacadeService extends BaseFacade {
  private service = inject(IdentityService);

  private _roles = signal<RoleDetailsDto[]>([]);
  roles = this._roles.asReadonly();

  private _permissions = signal<PermissionDto[]>([]);
  permissions = this._permissions.asReadonly();

  private _isLoadingRoles = signal<boolean>(false);
  isLoadingRoles = this._isLoadingRoles.asReadonly();
  private _isLoadingPermissions = signal<boolean>(false);
  isLoadingPermissions = this._isLoadingPermissions.asReadonly();

  formValidationErrors = signal<Record<string, string[]>>({});

  loadRoles() {
    this._isLoadingRoles.set(true);
    this.service
      .getRoles()
      .pipe(
        tap((res) => {
          if (res.isSuccess && res.data) {
            this._roles.set(res.data);
          } else {
            this._roles.set([]);
            this.handleLoadError(res);
          }
        }),
        finalize(() => this._isLoadingRoles.set(false))
      )
      .subscribe();
  }

  loadPermissions(search?: string) {
    this._isLoadingPermissions.set(true);
    this.service
      .getAllPermissions(search)
      .pipe(
        tap((res) => {
          if (res.isSuccess && res.data) {
            this._permissions.set(res.data);
          } else {
            this._permissions.set([]);
            this.handleLoadError(res);
          }
        }),
        finalize(() => this._isLoadingPermissions.set(false))
      )
      .subscribe();
  }

  assignRoles(userId: string, dto: AssignRolesRequest) {
    return this.handleCreateOrUpdate(this.service.assignRoles(userId, dto), {
      successMessage: 'تم إسناد الأدوار بنجاح',
      defaultErrorMessage: 'فشل إسناد الأدوار. يرجى المحاولة لاحقاً.',
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

  grantPermissionsToUser(userId: string, dto: PermissionIdsRequest) {
    return this.handleCreateOrUpdate(
      this.service.grantPermissionsToUser(userId, dto),
      {
        successMessage: 'تم منح الصلاحيات للمستخدم بنجاح',
        defaultErrorMessage: 'فشل منح الصلاحيات. يرجى المحاولة لاحقاً.',
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

  activatePermissionsInRole(roleId: string, dto: PermissionIdsRequest) {
    return this.handleCreateOrUpdate(
      this.service.activatePermissionsInRole(roleId, dto),
      {
        successMessage: 'تم تفعيل صلاحيات الدور بنجاح',
        defaultErrorMessage: 'فشل تفعيل صلاحيات الدور. يرجى المحاولة لاحقاً.',
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

  deactivatePermissionsInRole(roleId: string, dto: PermissionIdsRequest) {
    return this.handleCreateOrUpdate(
      this.service.deactivatePermissionsInRole(roleId, dto),
      {
        successMessage: 'تم إلغاء صلاحيات الدور بنجاح',
        defaultErrorMessage: 'فشل إلغاء صلاحيات الدور. يرجى المحاولة لاحقاً.',
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
  // getEffectiveUserPermissions(userId: string) {
  //   this._isLoading.set(true);
  //   return this.service.getEffectiveUserPermissions(userId).pipe(
  //     tap((res) => {
  //       if (res.isSuccess && res.data) {
  //         // Optionally, you can store the user's current permissions in a signal
  //         this._permissions.set(
  //           this._permissions().map(p => ({
  //             ...p,
  //             granted: res.data.includes(p.name)
  //           }))
  //         );
  //       } else {
  //         this.toast.error('تعذر تحميل صلاحيات المستخدم.');
  //       }
  //     }),
  //     finalize(() => this._isLoading.set(false))
  //   );
  // }

  private handleLoadError(result: ApiResult<any>) {
    const err = this.extractError(result);
    if (err.type === 'validation' || err.type === 'business') {
      this.toast.error(err.message);
      return;
    }

    this.toast.error('تعذر تحميل البيانات. يرجى المحاولة لاحقاً.');
  }
}
