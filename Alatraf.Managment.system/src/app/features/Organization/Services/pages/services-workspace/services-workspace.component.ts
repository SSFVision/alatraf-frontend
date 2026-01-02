import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { ServicesFacade } from '../../Service/services.facade.service';
import { AddEditServicePageComponent } from '../add-edit-service-page/add-edit-service-page.component';

@Component({
  selector: 'app-services-workspace',
  standalone: true,
  imports: [CommonModule, AddEditServicePageComponent],
  templateUrl: './services-workspace.component.html',
  styleUrl: './services-workspace.component.css',
})
export class ServicesWorkspaceComponent {
  private facade = inject(ServicesFacade);
  private route = inject(ActivatedRoute);

  isLoading = this.facade.isLoading;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('serviceId');
      if (id) {
        const numeric = Number(id);
        if (!Number.isNaN(numeric)) {
          this.facade.loadServiceForEdit(numeric);
          return;
        }
      }

      // default to create mode when no valid id
      this.facade.enterCreateMode();
    });
  }
}
