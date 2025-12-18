import { Component, input, OnDestroy, output, signal } from '@angular/core';
import { DoctorWorkloadCardVM } from '../../models/doctor-workload-card.vm';

@Component({
  selector: 'app-doctor-card',
  imports: [],
  templateUrl: './doctor-card.component.html',
  styleUrl: './doctor-card.component.css',
})
export class DoctorCardComponent implements OnDestroy {
  doctors = input.required<DoctorWorkloadCardVM[]>();
  loading = input<boolean>(false);

  selectedId = signal<number | null>(null);

  select = output<number>();

  onSelect(doctor: DoctorWorkloadCardVM) {
    this.selectedId.set(doctor.id);
    this.select.emit(doctor.id);
  }

  ngOnDestroy(): void {
    this.selectedId.set(null);
  }
}
