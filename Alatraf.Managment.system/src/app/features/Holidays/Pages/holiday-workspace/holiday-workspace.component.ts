import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HolidaysNavigationFacade } from '../../../../core/navigation/Holidays-navigation.facade';

@Component({
  selector: 'app-holiday-workspace',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './holiday-workspace.component.html',
  styleUrl: './holiday-workspace.component.css',
})
export class HolidayWorkspaceComponent {
  private holidayNav = inject(HolidaysNavigationFacade);
  private router = inject(Router);

  activeTab=signal<'add' | 'list'>('add');

 
  goToAdd(): void {
    this.activeTab.set('add');
    this.holidayNav.goToAddHoliday();
  }

  goToList(): void {
    this.activeTab.set('list');
    this.holidayNav.goToHolidayList();
  }

  OnCloseHoliday() {
    this.holidayNav.goToManageAppointments();
  }

  
}
