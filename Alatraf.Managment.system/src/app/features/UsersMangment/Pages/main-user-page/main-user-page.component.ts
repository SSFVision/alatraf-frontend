import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsersNavigationFacade } from '../../../../core/navigation/users-navigation.facade';
import { UserListComponent } from '../../Components/user-list/user-list.component';
import { UserListItemDto } from '../../Models/Users/user-list-item.dto';
import { UsersFacade } from '../../Services/users.facade.service';

@Component({
  selector: 'app-main-user-page',
  imports: [RouterOutlet, UserListComponent],
  templateUrl: './main-user-page.component.html',
  styleUrl: './main-user-page.component.css',
})
export class MainUserPageComponent  implements OnInit{
  selectedId = signal<number | string | null>(null);
  private userNav = inject(UsersNavigationFacade);
  usersFacade = inject(UsersFacade);
  canRout = signal<boolean>(false);

  usersListItem=this.usersFacade.users;
  loadingUser=this.usersFacade.isLoading;

  ngOnInit(): void {
    this.usersFacade.loadUsers();
  }

  goToAddUser() {
    this.canRout.set(true);

    this.userNav.goToCreateUserPage();
  }

  OnSelectedUser(user: UserListItemDto) {
    this.selectedId.set(user.userId);
    this.canRout.set(true);
    this.userNav.goToEditUserPage(user.userId);
  }

  onSearch(term: string) {
    this.usersFacade.search(term);
  }
}
