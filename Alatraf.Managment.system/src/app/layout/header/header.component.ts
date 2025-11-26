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
  userName = this.auth.getUser()?.name!;


}
