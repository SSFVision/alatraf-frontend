import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { UserDetailsDto } from '../../../../core/auth/models/user-details.dto.';
import { PERMISSION_GROUPS } from '../../Permisions/permission-groups.constant';
import { PermissionGroup } from '../../Permisions/permissions.types';

@Component({
  selector: 'app-user-permissions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-permissions.component.html',
  styleUrls: ['./user-permissions.component.css'],
})
export class UserPermissionsComponent {
  user = input<UserDetailsDto | null>(null);

  roles = computed(() => this.user()?.roles ?? []);
  permissions = computed(() => this.user()?.permissions ?? []);
  permissionsSet = computed(() => new Set(this.permissions()));



  isPermGranted(perm?: string): boolean {
    if (!perm) return false;
    return this.permissionsSet().has(perm);
  }

  trackByName(index: number, value: string) {
    return value ?? index;
  }

  permissionGroups = PERMISSION_GROUPS;

  extraColumns = Array.from(
    new Set(
      this.permissionGroups.flatMap(
        (group) => group.extras?.map((extra) => extra.label) ?? []
      )
    )
  );

  trackByLabel(index: number, group: PermissionGroup) {
    return group.label ?? index;
  }

  trackByExtraHeader(index: number, label: string) {
    return label ?? index;
  }

  getExtraPerm(group: PermissionGroup, label: string): string | undefined {
    return group.extras?.find((extra) => extra.label === label)?.perm;
  }

  // ---- Column visibility ----
  hasAnyPermission(perms: (string | undefined)[]): boolean {
    const set = this.permissionsSet();
    return perms.some((p) => p && set.has(p));
  }
  hasAnyGroupPermission(group: PermissionGroup): boolean {
    const perms = [
      group.read,
      group.create,
      group.update,
      group.delete,
      group.print,
      group.changeStatus,
      ...(group.extras?.map((extra) => extra.perm) ?? []),
    ];
    return perms.some((p) => p && this.isPermGranted(p));
  }

  showRead = computed(() =>
    this.hasAnyPermission(this.permissionGroups.map((g) => g.read))
  );

  showCreate = computed(() =>
    this.hasAnyPermission(this.permissionGroups.map((g) => g.create))
  );

  showUpdate = computed(() =>
    this.hasAnyPermission(this.permissionGroups.map((g) => g.update))
  );

  showDelete = computed(() =>
    this.hasAnyPermission(this.permissionGroups.map((g) => g.delete))
  );

  showPrint = computed(() =>
    this.hasAnyPermission(this.permissionGroups.map((g) => g.print))
  );

  showChangeStatus = computed(() =>
    this.hasAnyPermission(this.permissionGroups.map((g) => g.changeStatus))
  );

  // ---- Filter extra columns based on user permissions ----
  visibleExtraColumns = computed(() => {
    const set = this.permissionsSet();
    return this.extraColumns.filter((label) =>
      this.permissionGroups.some((group) =>
        group.extras?.some(
          (extra) => extra.label === label && set.has(extra.perm)
        )
      )
    );
  });

  
  editUserPermissions(){
    
  }
}
