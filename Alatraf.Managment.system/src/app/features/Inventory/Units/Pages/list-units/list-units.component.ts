import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { UnitsNavigationFacade } from '../../../../../core/navigation/units-navigation.facade';
import { UnitsFacade as UnitsDataFacade } from '../../Services/unit.facade.service';
import { UnitDto } from '../../Models/unit.dto';

@Component({
  selector: 'app-list-units',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-units.component.html',
  styleUrl: './list-units.component.css',
})
export class ListUnitsComponent implements OnInit {
  private unitsNav = inject(UnitsNavigationFacade);
  private unitsFacade = inject(UnitsDataFacade);

  private searchTerm = signal<string>('');

  filteredUnits = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const units = this.unitsFacade.units();

    if (!term) return units;

    return units.filter((unit) => unit.name?.toLowerCase().includes(term));
  });

  ngOnInit(): void {
    this.unitsFacade.loadUnits();
  }

  onSearch(term: string): void {
    this.searchTerm.set(term ?? '');
  }

  onEdit(unit: UnitDto): void {
    if (!unit?.id) return;
    this.unitsNav.goToEditUnitsPage(unit.id);
  }

  onDelete(unit: UnitDto): void {
    this.unitsFacade.deleteUnit(unit);
  }
}
