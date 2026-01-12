import { Component, inject, signal } from '@angular/core';
import { AuthFacade } from '../../core/auth/auth.facade';
import { UsersNavigationFacade } from '../../core/navigation/users-navigation.facade';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  auth = inject(AuthFacade);
  user = this.auth.getUser()!;
  private userNav = inject(UsersNavigationFacade);

  userName= signal<string>(this.user.username);
OnChnageUserInfo(){
  // this.auth.goToUserProfilePage();
this.userNav.goToChangeCredentialsPage(this.user.userId);
}
}
