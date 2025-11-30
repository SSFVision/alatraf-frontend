import { Component, computed, inject, signal } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from "@angular/router";
import { UiLockService } from './core/services/ui-lock.service';

@Component({
  selector: 'app-root',
  standalone:true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet]
})
export class AppComponent {
  title = 'Alatraf.Managment.system';



}
