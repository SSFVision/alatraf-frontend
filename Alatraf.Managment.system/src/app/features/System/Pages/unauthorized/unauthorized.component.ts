import { Component, inject } from '@angular/core';
import { AuthFacade } from '../../../../core/auth/auth.facade';
import { NavigationAuthFacade } from '../../../../core/navigation/navigation-auth.facade';

@Component({
  selector: 'app-unauthorized',
  imports: [],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.css',
})
export class UnauthorizedComponent {
  private auth = inject(AuthFacade);
  private navigation = inject(NavigationAuthFacade);

  goHome() {
    const role = this.auth.getUser()?.roles?.[0] as any;
    this.navigation.goToRoleHome(role);
  }
}
