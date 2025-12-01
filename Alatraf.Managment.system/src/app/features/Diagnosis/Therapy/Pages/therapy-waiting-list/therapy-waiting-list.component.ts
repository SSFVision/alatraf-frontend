import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PatientCardComponent } from "../../../Shared/Components/patient-card/patient-card.component";

@Component({
  selector: 'app-therapy-waiting-list',
  imports: [RouterOutlet, PatientCardComponent],
  templateUrl: './therapy-waiting-list.component.html',
  styleUrl: './therapy-waiting-list.component.css',
})
export class TherapyWaitingListComponent {
  selectedPatient = signal<any>(null);
}
