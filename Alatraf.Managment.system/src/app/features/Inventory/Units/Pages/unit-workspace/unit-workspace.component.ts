import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

import { UnitsNavigationFacade } from '../../../../../core/navigation/units-navigation.facade';

@Component({
  selector: 'app-unit-workspace',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterOutlet],
  templateUrl: './unit-workspace.component.html',
  styleUrl: './unit-workspace.component.css',
})
export class UnitWorkspaceComponent {
  private nav = inject(UnitsNavigationFacade);

  activeTab = signal<'add' | 'list'>('add');

  goToAdd(): void {
    this.activeTab.set('add');
    this.nav.goToAddNewUnitsPage();
  }

  goToList(): void {
    this.activeTab.set('list');
    this.nav.goToListUnitsPage();
  }
}
