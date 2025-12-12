import { Component, input, output, Output } from '@angular/core';
import { SessionDto } from '../../Models/session.dto';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-previous-therapy-sessions-history',
  imports: [NgFor,NgIf],
  templateUrl: './previous-therapy-sessions-history.component.html',
  styleUrl: './previous-therapy-sessions-history.component.css'
})
export class PreviousTherapySessionsHistoryComponent {
 sessions = input<SessionDto[]>([]);
  viewDetails = output<number>();
}
