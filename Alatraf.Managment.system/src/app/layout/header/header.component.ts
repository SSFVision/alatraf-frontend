import { Component, inject, signal } from '@angular/core';
import { AuthFacade } from '../../core/auth/auth.facade';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  auth = inject(AuthFacade);
  user = this.auth.getUser()!;

  userName= signal<string>(this.user.username);

}
