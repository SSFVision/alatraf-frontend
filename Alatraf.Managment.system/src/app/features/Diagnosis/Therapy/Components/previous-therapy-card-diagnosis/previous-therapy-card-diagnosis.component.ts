import { Component, EventEmitter, input, Input, OnDestroy, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TherapyCardDiagnosisDto } from '../../Models/therapy-card-diagnosis.dto';
import { InjuryDto } from '../../../../../core/models/injuries/injury.dto';

@Component({
  selector: 'app-previous-therapy-card-diagnosis',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './previous-therapy-card-diagnosis.component.html',
  styleUrl: './previous-therapy-card-diagnosis.component.css',
})
export class PreviousTherapyCardDiagnosisComponent   {
   @Input() items: TherapyCardDiagnosisDto[] = [];

  @Output() viewDetails = new EventEmitter<TherapyCardDiagnosisDto>();

  getInjuryNames(list: InjuryDto[] | undefined | null): string {
    if (!list || list.length === 0) return '—';
    return list.map(x => x.name).join('، ');
  }

  onView(card: TherapyCardDiagnosisDto) {
    this.viewDetails.emit(card);
  }
}
