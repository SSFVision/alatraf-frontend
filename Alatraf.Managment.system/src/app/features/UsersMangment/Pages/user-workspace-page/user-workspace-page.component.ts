import { Component, inject, OnInit, signal } from '@angular/core';
import { UserDetailsComponent } from '../../Components/user-details/user-details.component';
import { UserPermissionsComponent } from '../../Components/user-permissions/user-permissions.component';
import { UsersNavigationFacade } from '../../../../core/navigation/users-navigation.facade';
import { ActivatedRoute } from '@angular/router';
import { RolesAndPermissionsFacadeService } from '../../Services/roles-and-permissions.facade.service';
import { UsersFacadeService } from '../../Services/users.facade.service';
import { EditUserPermissionsComponent } from '../edit-user-permissions/edit-user-permissions.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-user-workspace-page',
  standalone: true,
  imports: [
    UserDetailsComponent,
    UserPermissionsComponent,
    EditUserPermissionsComponent,
    NgIf,
  ],
  templateUrl: './user-workspace-page.component.html',
  styleUrl: './user-workspace-page.component.css',
})
export class UserWorkspacePageComponent implements OnInit {
  userNav = inject(UsersNavigationFacade);
  private route = inject(ActivatedRoute);
  private rolePermissionFacade = inject(RolesAndPermissionsFacadeService);
  isLoadingRoles = this.rolePermissionFacade.isLoadingRoles;
  roles = this.rolePermissionFacade.roles;
  private userFacade = inject(UsersFacadeService);
  selectedUser = this.userFacade.selectedUser;
  isLoadingSelectedUser = this.userFacade.isLoadingSelectedUser;
  currentUserId: string | null = null;

  ngOnInit(): void {
    this.listenToRoute();
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
  canedit = signal(false);
  editUserPermissions() {
    this.canedit.set(!this.canedit());
  }
  OnCloseEditUserPermissions() {
    this.canedit.set(false);
            this.userFacade.getUserById(this.currentUserId!);

  }
}
