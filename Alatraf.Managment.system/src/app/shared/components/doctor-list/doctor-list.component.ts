import { Department } from './../../../features/Diagnosis/Shared/enums/department.enum';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  input,
  output,
  Output,
  signal
} from '@angular/core';
import { DoctorListItemDto } from '../../../features/Organization/Doctors/Models/doctor-list-item.dto';

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-list.component.html',
  styleUrl: './doctor-list.component.css',
})
export class DoctorListComponent {
  doctors = input.required<DoctorListItemDto[]>();
  loading = input<boolean>(false);
  selectedId = signal<number | null>(null);
  doctorSelectedId = output<number>();


  onSelect(doctor: DoctorListItemDto): void {
    this.selectedId.set(doctor.doctorId);
    this.doctorSelectedId.emit(doctor.doctorId);
  }

  gitDectorDepartment(DepartmentId: number): string {

      return  DepartmentId === 1 ? 'فني' : 'علاج ';
  }
}
