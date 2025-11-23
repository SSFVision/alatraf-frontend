import { Component, inject, signal } from '@angular/core';
import { MENU_CONFIG, MenuCategory } from '../../core/navigation/sidebar.items';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { NavigationAuthFacade } from '../../core/navigation/navigation-auth.facade';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {



 menu =signal< MenuCategory[]>([])
  constructor() {
    this.menu.set( MENU_CONFIG.map((category) => {
      const filteredItems = category.items;
      return {
        ...category,
        items: filteredItems,
      };
    }).filter((category) => category.items.length > 0)); // remove empty categories
  }


  private navAuth=inject(NavigationAuthFacade);
  OnLogOut(){
this.navAuth.goToLogout();
  }
}
