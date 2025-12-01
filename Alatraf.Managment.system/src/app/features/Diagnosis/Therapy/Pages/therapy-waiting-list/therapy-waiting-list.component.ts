import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WaitingPatientPageComponent } from '../../../Shared/Pages/waiting-patient-page/waiting-patient-page.component';

@Component({
  selector: 'app-therapy-waiting-list',
  imports: [WaitingPatientPageComponent, RouterOutlet],
  templateUrl: './therapy-waiting-list.component.html',
  styleUrl: './therapy-waiting-list.component.css',
})
export class TherapyWaitingListComponent {
  selectedPatient = signal<any>(null);
}
