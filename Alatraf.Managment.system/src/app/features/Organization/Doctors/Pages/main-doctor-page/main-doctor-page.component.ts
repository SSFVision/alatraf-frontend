import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule for directives like [class.active]

import { DoctorsNavigationFacade } from '../../../../../core/navigation/doctors-navigation.facade';
import { DoctorFacade } from '../../Service/doctor.facade.service';
import { DoctorListComponent } from '../../../../../shared/components/doctor-list/doctor-list.component';
import { Department } from '../../../../Diagnosis/Shared/enums/department.enum';

@Component({
  selector: 'app-main-doctor-page',
  standalone: true, // Add standalone: true
  imports: [CommonModule, RouterOutlet, DoctorListComponent], // Add CommonModule
  templateUrl: './main-doctor-page.component.html',
  styleUrl: './main-doctor-page.component.css',
})
export class MainDoctorPageComponent implements OnInit {
  private facade = inject(DoctorFacade);
  private doctorNav = inject(DoctorsNavigationFacade);

  Department = Department;

  doctors = this.facade.doctors;
  loading = this.facade.isLoading;

  selectedDepartment = signal<Department | null>(null);

  ngOnInit(): void {
    this.facade.resetFilters();
    this.facade.loadDoctors();
  }

  onDoctorSelected(doctorId: number): void {
    this.doctorNav.goToEditDoctorPage(doctorId);
  }

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.facade.search(term);
  }

  onFilterChange(department: Department | null): void {
    this.selectedDepartment.set(department); // For UI active state
    this.facade.setDepartment(department); // Update the filter in the facade
  }

  goToAddDoctor(): void {
    this.doctorNav.goToCreateDoctorPage();
  }
}
