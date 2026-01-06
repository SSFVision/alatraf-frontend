import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IndustrialDiagnosisHistoryDto } from '../../Models/industrial-diagnosis-history.dto';
import { DatePipe } from '@angular/common';
import { RepairCardDiagnosisDto } from '../../Models/repair-card-diagnosis.dto';

@Component({
  selector: 'app-previous-industrial-diagnosis',
  imports: [DatePipe],
  templateUrl: './previous-industrial-diagnosis.component.html',
  styleUrl: './previous-industrial-diagnosis.component.css',
})
export class PreviousIndustrialDiagnosisComponent {
  @Input({ required: true }) items: RepairCardDiagnosisDto[] = [];
  @Output() viewDetails = new EventEmitter<RepairCardDiagnosisDto>();

  onView(row: RepairCardDiagnosisDto) {
    this.viewDetails.emit(row);
  }

  formatNames(list?: { name: string }[] | null): string {
    if (!list || list.length === 0) {
      return '—';
    }

    return list.map((item) => item.name).join(', ');
  }
}
