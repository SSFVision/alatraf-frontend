import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ManagementEntityCardComponent } from '../../../../shared/components/management-entity-card/management-entity-card.component';
import { ManagementEntityCardUiModel } from '../../../../shared/models/management-entity-card.ui-model';
import { IndustrialPartsNavigationFacade } from '../../../../core/navigation/industrial-parts-navigation.facade';

@Component({
  selector: 'app-main-industrial-parts-page',
  imports: [RouterOutlet, ManagementEntityCardComponent],
  templateUrl: './main-industrial-parts-page.component.html',
  styleUrl: './main-industrial-parts-page.component.css',
})
export class MainIndustrialPartsPageComponent {
  card = signal(MANAGEMENT_ENTITY_CARD_TEST_DATA);
  loading = signal(false);
  selectedId = signal<number | string | null>(null);
  private nav = inject(IndustrialPartsNavigationFacade);

  onCardSelected(id: number | string) {
    this.selectedId.set(id);
    this.nav.goToViewIndustrialPartPage(id);
  }
  goToAddMedicalProgram() {
    this.nav.goToCreateIndustrialPartPage();
  }
}
export const MANAGEMENT_ENTITY_CARD_TEST_DATA: ManagementEntityCardUiModel[] = [
  {
    id: 101,
    name: 'مفصل ركبة صناعي',
    sectionName: 'الأطراف الصناعية',
  },
  {
    id: 102,
    name: 'مفصل كاحل صناعي',
    sectionName: 'الأطراف الصناعية',
  },
  {
    id: 103,
    name: 'دعامة ظهر طبية',
    sectionName: 'الدعامات الطبية',
  },
  {
    id: 104,
    name: 'جبيرة يد',
    sectionName: 'الدعامات الطبية',
  },
];
