import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SectionsNavigationFacade } from '../../../../../core/navigation/sections-navigation.facade';
import { ManagementEntityCardComponent } from '../../../../../shared/components/management-entity-card/management-entity-card.component';
import { ManagementEntityCardUiModel } from '../../../../../shared/models/management-entity-card.ui-model';

import { SectionsFacade } from '../../Service/sections.facade.service';
import { Department } from '../../../../Diagnosis/Shared/enums/department.enum';
import { WorkspaceWelcomeComponent } from "../../../../../shared/components/workspace-welcome/workspace-welcome.component";

@Component({
  selector: 'app-main-section-page',
  imports: [ManagementEntityCardComponent, RouterOutlet, WorkspaceWelcomeComponent],
  templateUrl: './main-section-page.component.html',
  styleUrl: './main-section-page.component.css',
})
export class MainSectionPageComponent implements OnInit {
  facade = inject(SectionsFacade);
  private nav = inject(SectionsNavigationFacade);

  card = signal<ManagementEntityCardUiModel[]>([]);
  selectedId = signal<number | string | null>(null);
  addMode = signal<boolean>(false);

  department = Department;
  activeDepartment = signal<number | null>(null);

  loading = this.facade.isLoading;
  loadingMore = this.facade.isLoadingNextPage;

  constructor() {
    effect(() => {
      const sections = this.facade.sections();

      this.card.set(
        sections.map((s) => ({
          id: s.id,
          name: s.name,
          sectionName: s.departmentName ?? null,
        }))
      );
    });
  }

  ngOnInit(): void {
    this.facade.resetAndLoad();
  }


  onCardSelected(id: number | string) {
    this.selectedId.set(id);
    this.addMode.set(false);
    this.nav.goToEditSectionPage(id);
  }

  goToAddSection() {
    this.selectedId.set(null);
    this.addMode.set(true);
    this.facade.enterCreateMode();
    this.nav.goToCreateSectionPage();
  }

  onSearch(term: string) {
    this.facade.search(term);
  }

  filterByDepartment(departmentID: Department | null) {
    this.activeDepartment.set(departmentID);
    this.facade.setDepartment(departmentID);
  }

  onLoadMore() {
    this.facade.loadNextPage();
  }
}
