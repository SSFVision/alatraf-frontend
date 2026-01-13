import { CommonModule } from '@angular/common';
import {
  Component,
  EnvironmentInjector,
  OnInit,
  effect,
  computed,
  inject,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { finalize } from 'rxjs/operators';
import { UsersNavigationFacade } from '../../../../core/navigation/users-navigation.facade';
import { ActivatedRoute } from '@angular/router';
import { RolesAndPermissionsFacadeService } from '../../Services/roles-and-permissions.facade.service';
import { UsersFacadeService } from '../../Services/users.facade.service';
import { RoleDetailsDto } from '../../Models/Roles/role-details.dto';
import { mapRoleToArabic } from '../../../../core/auth/Roles/app.user.roles.enum';

@Component({
  selector: 'app-user-role-assign',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-role-assign.component.html',
  styleUrl: './user-role-assign.component.css',
})
export class UserRoleAssignComponent implements OnInit {
  userNav = inject(UsersNavigationFacade);
  private route = inject(ActivatedRoute);
  private rolePermissionFacade = inject(RolesAndPermissionsFacadeService);
  isLoadingRoles = this.rolePermissionFacade.isLoadingRoles;
  roles = this.rolePermissionFacade.roles;
  private userFacade = inject(UsersFacadeService);
  selectedUser = this.userFacade.selectedUser;
  isLoadingSelectedUser = this.userFacade.isLoadingSelectedUser;
  isInitialLoading = computed(
    () => this.isLoadingRoles() || this.isLoadingSelectedUser()
  );
  hasLoadedData = computed(() => {
    const user = this.selectedUser();
    const roles = this.roles();
    // Consider data ready when we have a user and either roles finished loading or some roles arrived
    return !!user && (!this.isLoadingRoles() || roles.length > 0);
  });

  currentUserId: string | null = null;
  selectedRoleIds = signal<string[]>([]);
  isSaving = signal(false);
  private env = inject(EnvironmentInjector);
  mapRoleToArabic = mapRoleToArabic;

  ngOnInit(): void {
    this.listenToRoute();
    this.rolePermissionFacade.loadRoles();
    console.log('Roles Loaded:', this.roles());
    runInInjectionContext(this.env, () => {
      effect(() => {
        const user = this.selectedUser();
        const availableRoles = this.roles();
        if (!user) {
          this.selectedRoleIds.set([]);
          return;
        }

        const userRoleNames = new Set(user.roles ?? []);
        const matchedRoleIds = availableRoles
          .filter((r) => userRoleNames.has(r.name))
          .map((r) => r.roleId);

        this.selectedRoleIds.set(matchedRoleIds);
      });
    });
  }

  onClose() {
    this.userNav.goToEditUserPage(this.currentUserId!);
  }

  trackByRoleId(index: number, role: RoleDetailsDto) {
    return role.roleId ?? index;
  }

  isRoleChecked(role: RoleDetailsDto): boolean {
    return this.selectedRoleIds().includes(role.roleId);
  }

  onRoleToggle(event: Event, role: RoleDetailsDto) {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedRoleIds.update((ids) => {
      if (checked) {
        return ids.includes(role.roleId) ? ids : [...ids, role.roleId];
      }
      return ids.filter((id) => id !== role.roleId);
    });
  }

  onSave() {
    if (!this.currentUserId) return;

    const roleIds = this.selectedRoleIds();
    this.isSaving.set(true);
    this.rolePermissionFacade
      .assignRoles(this.currentUserId, { roleIds })
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe();
  }

  private listenToRoute() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('userId');

      if (id) {
        this.currentUserId = id;
        this.userFacade.getUserById(id);
      }
    });
  }
}
