import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IndustrialPartsNavigationFacade } from '../../../../core/navigation/industrial-parts-navigation.facade';
import { ManagementEntityCardComponent } from '../../../../shared/components/management-entity-card/management-entity-card.component';
import { ManagementEntityCardUiModel } from '../../../../shared/models/management-entity-card.ui-model';
import { IndustrialPartsFacade } from '../../Services/industrial-parts.facade.service';
import { throttleTime } from 'rxjs';
import { UnitsNavigationFacade } from '../../../../core/navigation/units-navigation.facade';

@Component({
  selector: 'app-main-industrial-parts-page',
  imports: [RouterOutlet, ManagementEntityCardComponent],
  templateUrl: './main-industrial-parts-page.component.html',
  styleUrl: './main-industrial-parts-page.component.css',
})
export class MainIndustrialPartsPageComponent {
  private facade = inject(IndustrialPartsFacade);
  private nav = inject(IndustrialPartsNavigationFacade);

  card = signal<ManagementEntityCardUiModel[]>([]);
  loading = this.facade.isLoading;
  selectedId = signal<number | string | null>(null);
  addMode = signal<boolean>(false);

  constructor() {
    effect(() => {
      const programs = this.facade.industrialParts();
      this.card.set(
        programs.map((p) => ({
          id: p.industrialPartId,
          name: p.name,
          // sectionName: p.industrialPartUnits ?? null,
        }))
      );
    });
  }
  ngOnInit(): void {
    this.facade.loadIndustrialParts();
  }
  onCardSelected(id: number | string) {
    this.selectedId.set(id);
    this.nav.goToEditIndustrialPartPage(id);
  }
  private navUnit = inject(UnitsNavigationFacade);
  onAddUnit() {
    this.navUnit.goToAddNewUnitsPage();
  }
  goToIndustrialPart() {
    this.addMode.set(true);
    this.nav.goToCreateIndustrialPartPage();
  }
  onSearch(term: string) {
    this.facade.search(term);
  }
}
