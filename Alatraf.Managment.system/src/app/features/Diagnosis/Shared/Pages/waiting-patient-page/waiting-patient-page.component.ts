import { Component } from '@angular/core';
import { PatientCardComponent } from "../../Components/patient-card/patient-card.component";

@Component({
  selector: 'app-waiting-patient-page',
  imports: [PatientCardComponent],
  templateUrl: './waiting-patient-page.component.html',
  styleUrl: './waiting-patient-page.component.css'
})
export class WaitingPatientPageComponent {
waitingPatients=[1,2,3,4,5,6,7,8,9,10];
}
