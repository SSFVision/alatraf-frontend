import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SectionsFacade } from '../../Service/sections.facade.service';
import { AddEditSectionPageComponent } from '../add-edit-section-page/add-edit-section-page.component';

@Component({
  selector: 'app-sections-workspace',
  imports: [AddEditSectionPageComponent],
  templateUrl: './sections-workspace.component.html',
  styleUrl: './sections-workspace.component.css',
})
export class SectionsWorkspaceComponent {
  private route = inject(ActivatedRoute);
  private facade = inject(SectionsFacade);

  isLoading = signal(true);

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('sectionId');

      this.isLoading.set(true);

      if (id) {
        this.facade.loadSectionForEdit(+id);
      } else {
        this.facade.enterCreateMode();
      }
      this.isLoading.set(false);
    });
  }
}
