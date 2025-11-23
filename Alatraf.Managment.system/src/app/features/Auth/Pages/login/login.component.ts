import { Component, inject } from '@angular/core';
import { NavigationAuthFacade } from '../../../../core/navigation/navigation-auth.facade';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private navAuth = inject(NavigationAuthFacade);

  OnLogin() {
    
    this.navAuth.redirectAfterLogin('Reception');
  }
}
