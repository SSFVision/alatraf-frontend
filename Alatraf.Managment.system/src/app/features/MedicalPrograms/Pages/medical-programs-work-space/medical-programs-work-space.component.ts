import { Component, inject, signal } from '@angular/core';
import { AddEditMedicalProgramComponent } from '../add-edit-medical-program/add-edit-medical-program.component';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { MedicalProgramsFacade } from '../../Services/medical-programs.facade.service';

@Component({
  selector: 'app-medical-programs-work-space',
  standalone: true,
  imports: [AddEditMedicalProgramComponent],
  templateUrl: './medical-programs-work-space.component.html',
  styleUrl: './medical-programs-work-space.component.css',
})
export class MedicalProgramsWorkSpaceComponent {
  private route = inject(ActivatedRoute);
  private facade = inject(MedicalProgramsFacade);

  isLoading = signal(true);

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('medicalProgramId');

      this.isLoading.set(true);

      if (id) {
        this.facade.loadMedicalProgramForEdit(+id);
      } else {
        this.facade.enterCreateMode();
      }
      this.isLoading.set(false);
    });
  }
}
