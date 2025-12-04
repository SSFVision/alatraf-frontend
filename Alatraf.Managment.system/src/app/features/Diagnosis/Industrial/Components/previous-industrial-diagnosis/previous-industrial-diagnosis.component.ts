import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IndustrialDiagnosisHistoryDto } from '../../Models/industrial-diagnosis-history.dto';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-previous-industrial-diagnosis',
  imports: [DatePipe],
  templateUrl: './previous-industrial-diagnosis.component.html',
  styleUrl: './previous-industrial-diagnosis.component.css'
})
export class PreviousIndustrialDiagnosisComponent {
 @Input({ required: true }) items: IndustrialDiagnosisHistoryDto[] = [];
  @Output() viewDetails = new EventEmitter<IndustrialDiagnosisHistoryDto>();

  onView(row: IndustrialDiagnosisHistoryDto) {
    this.viewDetails.emit(row);
  }
}
