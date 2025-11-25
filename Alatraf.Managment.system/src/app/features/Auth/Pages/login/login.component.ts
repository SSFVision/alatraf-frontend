import { LoginRequest } from './../../../../core/auth/models/login-request.model';
import { Component, Inject, inject } from '@angular/core';
import { AuthFacade } from '../../../../core/auth/auth.facade';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  aut = inject(AuthFacade);

  OnLogin() {
    console.log('login clalled');
    // this.aut.login();
  }
}