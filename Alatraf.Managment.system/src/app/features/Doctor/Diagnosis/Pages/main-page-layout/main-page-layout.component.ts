import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WaitingPatientPageComponent } from '../waiting-patient-page/waiting-patient-page.component';

@Component({
  selector: 'app-main-page-layout',
  imports: [RouterOutlet, WaitingPatientPageComponent],
  templateUrl: './main-page-layout.component.html',
  styleUrl: './main-page-layout.component.css',
})
export class MainPageLayoutComponent {
  selectedPatient = signal<any>(null);
}
