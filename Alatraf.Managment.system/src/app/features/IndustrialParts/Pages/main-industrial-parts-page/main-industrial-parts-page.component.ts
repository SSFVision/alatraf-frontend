import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ManagementEntityCardUiModel } from '../../../../shared/models/management-entity-card.ui-model';
import { IndustrialPartsNavigationFacade } from '../../../../core/navigation/industrial-parts-navigation.facade';
import { ManagementEntityCardComponent } from '../../../../shared/components/management-entity-card/management-entity-card.component';
import { MedicalProgramsNavigationFacade } from '../../../../core/navigation/navigation-medical-programs.facade';
import { MedicalProgramsFacade } from '../../../MedicalPrograms/Services/medical-programs.facade.service';
import { IndustrialPartsFacade } from '../../Services/industrial-parts.facade.service';

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
  loading = signal<boolean>(true);
  selectedId = signal<number | string | null>(null);
  addMode = signal<boolean>(false);

  constructor() {
    this.facade.loadIndustrialParts();
    effect(() => {
      const programs = this.facade.industrialParts();
      this.card.set(
        programs.map((p) => ({
          id: p.industrialPartId,
          name: p.name,
          // sectionName: p.industrialPartUnits ?? null,
        }))
      );

      this.loading.set(false);
    });
  }

  onCardSelected(id: number | string) {
    this.selectedId.set(id);
    this.nav.goToEditIndustrialPartPage(id);
  }

  goToIndustrialPart() {
    this.addMode.set(true);
    this.nav.goToCreateIndustrialPartPage();
  }
  onSearch(term: string) {
    this.facade.search(term);
  }
}
