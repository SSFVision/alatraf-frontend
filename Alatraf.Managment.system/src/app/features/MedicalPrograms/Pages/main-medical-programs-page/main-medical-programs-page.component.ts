import { MedicalProgramsNavigationFacade } from '../../../../core/navigation/navigation-medical-programs.facade';
import { Component, effect, inject, signal, OnInit } from '@angular/core';
import { ManagementEntityCardComponent } from '../../../../shared/components/management-entity-card/management-entity-card.component';
import { ManagementEntityCardUiModel } from '../../../../shared/models/management-entity-card.ui-model';
import { RouterOutlet } from '@angular/router';
import { MedicalProgramsFacade } from '../../Services/medical-programs.facade.service';
import { WorkspaceWelcomeComponent } from "../../../../shared/components/workspace-welcome/workspace-welcome.component";

@Component({
  selector: 'app-medical-programs-page',
  imports: [ManagementEntityCardComponent, RouterOutlet, WorkspaceWelcomeComponent],
  templateUrl: './main-medical-programs-page.component.html',
  styleUrl: './main-medical-programs-page.component.css',
})
export class MainMedicalProgramsPageComponent implements OnInit {
  private facade = inject(MedicalProgramsFacade);
  private nav = inject(MedicalProgramsNavigationFacade);

  card = signal<ManagementEntityCardUiModel[]>([]);
  selectedId = signal<number | string | null>(null);
  addMode = signal<boolean>(false);

  // ✅ loader من الـ facade
  loading = this.facade.isLoading;

  constructor() {
    effect(() => {
      const programs = this.facade.medicalPrograms();

      this.card.set(
        programs.map((p) => ({
          id: p.id,
          name: p.name,
          sectionName: p.sectionName ?? null,
        }))
      );
    });
  }

  ngOnInit(): void {
    this.facade.loadMedicalPrograms();
  }

  onCardSelected(id: number | string) {
    this.selectedId.set(id);
    this.nav.goToEditMedicalProgramPage(id);
  }

  goToAddMedicalProgram() {
    this.addMode.set(true);
    this.nav.goToCreateMedicalProgramPage();
  }

  onSearch(term: string) {
    this.facade.search(term);
  }
}
