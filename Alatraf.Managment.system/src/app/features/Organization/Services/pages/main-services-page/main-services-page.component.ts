import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ServicesNavigationFacade } from '../../../../../core/navigation/services-navigation.facade';
import { ManagementEntityCardComponent } from '../../../../../shared/components/management-entity-card/management-entity-card.component';
import { ManagementEntityCardUiModel } from '../../../../../shared/models/management-entity-card.ui-model';

import { ServicesFacade } from '../../Service/services.facade.service';
import { DepartmentsFacade } from '../../../../../features/Organization/Departments/departments.facade.service';
import { Department } from '../../../../Diagnosis/Shared/enums/department.enum';

@Component({
  selector: 'app-main-services-page',
  standalone: true,
  imports: [ManagementEntityCardComponent, RouterOutlet, CommonModule],
  templateUrl: './main-services-page.component.html',
  styleUrl: './main-services-page.component.css',
})
export class MainServicesPageComponent {
  facade = inject(ServicesFacade);
  private nav = inject(ServicesNavigationFacade);
  private departmentsFacade = inject(DepartmentsFacade);

  card = signal<ManagementEntityCardUiModel[]>([]);
  selectedId = signal<number | string | null>(null);
  addMode = signal<boolean>(false);

  department = Department;
  activeDepartment = signal<number | null>(null);

  loading = this.facade.isLoading;

  constructor() {
    effect(() => {
      const services = this.facade.services();

      this.card.set(
        services.map((s) => ({
          id: s.serviceId,
          name: s.name,
          sectionName: s.department ?? null,
        }))
      );
    });
  }

  ngOnInit(): void {
    this.departmentsFacade.loadDepartments();
    this.facade.resetAndLoad();
  }

  onCardSelected(id: number | string) {
    this.selectedId.set(id);
    this.addMode.set(false);
    this.nav.goToEditServicePage(id);
  }

  goToAddService() {
    this.selectedId.set(null);
    this.addMode.set(true);
    this.facade.enterCreateMode();
    this.nav.goToCreateServicePage();
  }

  onSearch(term: string) {
    this.facade.search(term);
  }
  filterByDepartment(departmentID: Department | null) {
    this.activeDepartment.set(departmentID);
    this.facade.setDepartment(departmentID as number | null);
  }
}
