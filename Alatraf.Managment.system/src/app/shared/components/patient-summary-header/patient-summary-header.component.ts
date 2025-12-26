import { Component, Input } from '@angular/core';
import { PatientSummaryUiDto } from '../../models/patient-summary.ui-dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-summary-header',
  standalone: true,
  imports: [CommonModule],
    templateUrl: './patient-summary-header.component.html',
  styleUrl: './patient-summary-header.component.css'
})
export class PatientSummaryHeaderComponent {
  @Input({ required: true }) patient!: PatientSummaryUiDto;

}
