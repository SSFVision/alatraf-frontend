import { Component, input, output } from '@angular/core';
import { CreatePatientRequest } from '../../../Reception/Patients/models/create-patient.request';

@Component({
  selector: 'app-add-medical-program-form',
  imports: [],
  templateUrl: './add-medical-program-form.component.html',
  styleUrl: './add-medical-program-form.component.css'
})
export class AddMedicalProgramFormComponent {
 close = output();
  save = output<CreatePatientRequest>();
  mode = input.required<boolean>();
 
}
