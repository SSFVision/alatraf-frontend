import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  input,
  Input,
  OnChanges,
  OnInit,
  output,
} from '@angular/core';
import { PERMISSION_GROUPS } from '../../Permisions/permission-groups.constant';
import {
  PermissionGroup,
  ExtraPermission,
} from '../../Permisions/permissions.types';
import { FormsModule } from '@angular/forms';
import { UserDetailsDto } from '../../../../core/auth/models/user-details.dto.';
import { RolesAndPermissionsFacadeService } from '../../Services/roles-and-permissions.facade.service';
import { PermissionIdsRequest } from '../../Models/permission-ids.request';

@Component({
  selector: 'app-edit-user-permissions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-user-permissions.component.html',
  styleUrls: ['./edit-user-permissions.component.css'],
})
export class EditUserPermissionsComponent implements OnChanges, OnInit {
  user = input.required<UserDetailsDto>();
  close = output<void>();
  permissionGroups: readonly PermissionGroup[] = PERMISSION_GROUPS;
  private rolesPermissionsFacade = inject(RolesAndPermissionsFacadeService);

  selectedPermissions = new Set<string>();
  ngOnInit(): void {
    this.rolesPermissionsFacade.loadPermissions();
  }
  ngOnChanges() {
    if (this.user) {
      this.selectedPermissions = new Set(this.user().permissions ?? []);
    }
  }

  togglePermission(perm: string | undefined, event: Event) {
    if (!perm) return;
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) this.selectedPermissions.add(perm);
    else this.selectedPermissions.delete(perm);
  }

  isChecked(perm?: string): boolean {
    if (!perm) return false;
    return this.selectedPermissions.has(perm);
  }

  savePermissions() {
    if (!this.user()) return;
    const updatedPermissions = Array.from(this.selectedPermissions);

    const permissionIds = this.mapPermissionNamesToIds();
    console.log(
      'save this permissions',
      `is names ${updatedPermissions}`
    );
    const dto: PermissionIdsRequest = {
      permissionIds,
    };

    this.rolesPermissionsFacade
      .grantPermissionsToUser(this.user().userId, dto)
      .subscribe((res) => {
        if (res.success) {
          // this.close.emit();
        }
      });
  }

  private mapPermissionNamesToIds(): number[] {
    const allPermissions = this.rolesPermissionsFacade.permissions();

    return allPermissions
      .filter((p) => this.selectedPermissions.has(p.name))
      .map((p) => p.permissionId);
  }
  onClose() {
    this.close.emit();
  }
  // Return all permissions in a group (standard + extras)
  getGroupPermissions(group: PermissionGroup): string[] {
    return [
      group.read,
      group.create,
      group.update,
      group.delete,
      group.print,
      group.changeStatus,
      ...(group.extras?.map((extra) => extra.perm) ?? []),
    ].filter(Boolean) as string[];
  }

  // Check if all permissions in a card are checked
  isAllChecked(group: PermissionGroup): boolean {
    const perms = this.getGroupPermissions(group);
    return perms.every((p) => this.selectedPermissions.has(p));
  }

  // Check if some permissions are checked (for indeterminate state)
  isIndeterminate(group: PermissionGroup): boolean {
    const perms = this.getGroupPermissions(group);
    const checkedCount = perms.filter((p) =>
      this.selectedPermissions.has(p)
    ).length;
    return checkedCount > 0 && checkedCount < perms.length;
  }

  // Toggle all permissions in a card
  toggleAllCardPermissions(group: PermissionGroup, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const perms = this.getGroupPermissions(group);

    perms.forEach((p) => {
      if (checked) this.selectedPermissions.add(p);
      else this.selectedPermissions.delete(p);
    });
  }

  // Filtering  and search logic

  searchTerm: string = '';

  filteredGroups(): readonly PermissionGroup[] {
    let groups = this.permissionGroups;

    // 🔽 Filter by selected group
    if (this.selectedGroupLabel !== 'all') {
      groups = groups.filter((g) => g.label === this.selectedGroupLabel);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      groups = groups.filter((group) =>
        group.label.toLowerCase().includes(term)
      );
    }

    return groups;
  }

  selectedGroupLabel: string = 'all';

  groupSelectOptions = [
    { value: 'all', label: 'الكل' },
    ...PERMISSION_GROUPS.map((g) => ({
      value: g.label,
      label: g.label,
    })),
  ] as const;
}
