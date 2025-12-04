import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TherapyCardHistoryDto } from '../../Models/therapy-card-history.dto';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-previous-therapy-card-diagnosis',
  imports: [DatePipe],
  templateUrl: './previous-therapy-card-diagnosis.component.html',
  styleUrl: './previous-therapy-card-diagnosis.component.css'
})
export class PreviousTherapyCardDiagnosisComponent {
 @Input({ required: true }) items: TherapyCardHistoryDto[] = [];

  @Output() viewDetails = new EventEmitter<TherapyCardHistoryDto>();

  onView(card: TherapyCardHistoryDto) {
    this.viewDetails.emit(card);
  }
}
