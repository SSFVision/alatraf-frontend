import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { SectionsNavigationFacade } from '../../../../../core/navigation/sections-navigation.facade';
import { ManagementEntityCardComponent } from "../../../../../shared/components/management-entity-card/management-entity-card.component";
import { ManagementEntityCardUiModel } from '../../../../../shared/models/management-entity-card.ui-model';
import { SectionsFacade } from '../../Service/sections.facade.service';

@Component({
  selector: 'app-main-section-page',
  imports: [ManagementEntityCardComponent, RouterOutlet],
  templateUrl: './main-section-page.component.html',
  styleUrl: './main-section-page.component.css'
})
export class MainSectionPageComponent {
   private facade = inject(SectionsFacade);
  private nav = inject(SectionsNavigationFacade);

  // ---------------------------------------------
  // UI STATE
  // ---------------------------------------------
  card = signal<ManagementEntityCardUiModel[]>([]);
  loading = signal<boolean>(true);
  selectedId = signal<number | string | null>(null);
  addMode = signal<boolean>(false);

  constructor() {
    // initial load
    // this.facade.setDepartment(Department.Therapy)
    this.facade.loadSections();

    // react to facade changes
    effect(() => {
      const sections = this.facade.sections();

      this.card.set(
        sections.map((s) => ({
          id: s.id,
          name: s.name,
          sectionName: s.departmentName ?? null,
        }))
      );

      this.loading.set(false);
    });
  }

  // ---------------------------------------------
  // EVENTS
  // ---------------------------------------------
  onCardSelected(id: number | string) {
    this.selectedId.set(id);
    this.addMode.set(false);
    this.nav.goToEditSectionPage(id);
  }

  goToAddSection() {
    this.selectedId.set(null);
    this.addMode.set(true);
    this.nav.goToCreateSectionPage();
  }

  onSearch(term: string) {
    this.facade.search(term);
  }
}
