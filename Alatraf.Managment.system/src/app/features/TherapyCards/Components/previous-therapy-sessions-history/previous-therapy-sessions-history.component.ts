import { Component, input, output , Pipe } from '@angular/core';
import { SessionDto } from '../../Models/session.dto';
import { NgFor, NgIf } from '@angular/common';


@Component({
  selector: 'app-previous-therapy-sessions-history',
  imports: [NgIf,NgFor],
  templateUrl: './previous-therapy-sessions-history.component.html',
  styleUrl: './previous-therapy-sessions-history.component.css'
})
export class PreviousTherapySessionsHistoryComponent {
 sessions = input<SessionDto[]>([]);
  viewDetails = output<number>();
  constructor(){
    console.log("all session : ", this.sessions());
  }

}
