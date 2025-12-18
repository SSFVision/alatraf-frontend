import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AppRoutes } from '../../core/routing/app.routes.map';

@Injectable({ providedIn: 'root' })
export class RoomsNavigationFacade {
  private router = inject(Router);

  goToRoomsMainPage(extras?: NavigationExtras): void {
    this.go(AppRoutes.rooms.root, extras);
  }

  goToCreateRoomPage(extras?: NavigationExtras): void {
    this.go(`${AppRoutes.rooms.root}/${AppRoutes.rooms.create}`, extras);
  }

  goToEditRoomPage(roomId: number | string, extras?: NavigationExtras): void {
    this.go(`${AppRoutes.rooms.root}/${AppRoutes.rooms.edit(roomId)}`, extras);
  }

  goToViewRoomPage(roomId: number | string, extras?: NavigationExtras): void {
    this.go(`${AppRoutes.rooms.root}/${AppRoutes.rooms.view(roomId)}`, extras);
  }

  private go(path: string | any[], extras?: NavigationExtras): void {
    this.router.navigate(Array.isArray(path) ? path : [path], extras);
  }
}
