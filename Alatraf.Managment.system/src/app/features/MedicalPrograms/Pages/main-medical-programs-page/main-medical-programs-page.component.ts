import { MedicalProgramsNavigationFacade } from '../../../../core/navigation/navigation-medical-programs.facade';
import { Component, inject, signal } from '@angular/core';
import { ManagementEntityCardComponent } from '../../../../shared/components/management-entity-card/management-entity-card.component';
import { ManagementEntityCardUiModel } from '../../../../shared/models/management-entity-card.ui-model';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-medical-programs-page',
  imports: [ManagementEntityCardComponent, RouterOutlet],
  templateUrl: './main-medical-programs-page.component.html',
  styleUrl: './main-medical-programs-page.component.css',
})
export class MainMedicalProgramsPageComponent {
  card = signal(MANAGEMENT_ENTITY_CARD_TEST_DATA);
  loading = signal(false);
  selectedId = signal<number | string | null>(null);
  private nav = inject(MedicalProgramsNavigationFacade);

  onCardSelected(id: number | string) {
    this.selectedId.set(id);
    this.nav.goToViewMedicalProgramPage(id);
  }
  goToAddMedicalProgram() {
    this.nav.goToCreateMedicalProgramPage();
  }
}
export const MANAGEMENT_ENTITY_CARD_TEST_DATA: ManagementEntityCardUiModel[] = [
  {
    id: 1,
    name: 'مساج',
    sectionName: 'العلاج الطبيعي',
  },
  {
    id: 2,
    name: 'تمارين تأهيلية',
    sectionName: 'العلاج الطبيعي',
  },
  {
    id: 3,
    name: 'تقويم أطراف صناعية',
    sectionName: 'الأطراف الصناعية',
  },
  {
    id: 4,
    name: 'جبائر طبية',
    sectionName: 'العلاج الطبيعي',
  },
];
