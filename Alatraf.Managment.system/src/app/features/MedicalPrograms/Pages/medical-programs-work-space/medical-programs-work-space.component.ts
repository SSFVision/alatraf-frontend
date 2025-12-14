import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-medical-programs-work-space',
  imports: [],
  templateUrl: './medical-programs-work-space.component.html',
  styleUrl: './medical-programs-work-space.component.css'
})
export class MedicalProgramsWorkSpaceComponent {
  isLoading = signal(false);

}
