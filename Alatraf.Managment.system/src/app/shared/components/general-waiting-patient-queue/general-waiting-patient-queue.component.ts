import { Component, input, output, signal } from '@angular/core';
import { GeneralWaitingPatientVM } from '../../models/general-waiting-patient.vm';

@Component({
  selector: 'app-general-waiting-patient-queue',
  standalone:true,
  imports: [],
  templateUrl: './general-waiting-patient-queue.component.html',
  styleUrl: './general-waiting-patient-queue.component.css'
})
export class GeneralWaitingPatientQueueComponent {
patients = input<GeneralWaitingPatientVM[]>([]);
  loading = input<boolean>(false);

  select = output<GeneralWaitingPatientVM>();

  selectedId = signal<number | null>(null);
constructor(){
  console.log("patients : ",this.patients());
}
  onSelect(patient: GeneralWaitingPatientVM): void {
    this.selectedId.set(patient.id);
    this.select.emit(patient);
  }
}
