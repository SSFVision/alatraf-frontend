import { Component, inject } from '@angular/core';
import { DashboardNavigationFacade } from '../../../../core/navigation/dashboard-navigation.facade';

@Component({
  selector: 'app-dashboard-main-page',
  imports: [],
  templateUrl: './dashboard-main-page.component.html',
  styleUrl: './dashboard-main-page.component.css',
})
export class DashboardMainPageComponent {
  private dashNav = inject(DashboardNavigationFacade);

  goToUserPage() {
    this.dashNav.goToUsers();
  }
}
