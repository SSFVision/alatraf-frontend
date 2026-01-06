import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsersNavigationFacade } from '../../../../core/navigation/users-navigation.facade';
import { WorkspaceWelcomeComponent } from "../../../../shared/components/workspace-welcome/workspace-welcome.component";

@Component({
  selector: 'app-main-user-page',
  imports: [RouterOutlet, WorkspaceWelcomeComponent],
  templateUrl: './main-user-page.component.html',
  styleUrl: './main-user-page.component.css',
})
export class MainUserPageComponent {
  selectedId = signal<number | string | null>(null);
  private userNav = inject(UsersNavigationFacade);
  canRout = signal<boolean>(false);
  OnSelectedUser(userId: number) {
    this.selectedId.set(userId);
    this.canRout.set(true);
    this.userNav.goToEditUserPage(userId);
  }

  goToAddUser() {
    this.canRout.set(true);

    this.userNav.goToCreateUserPage();
  }
}
