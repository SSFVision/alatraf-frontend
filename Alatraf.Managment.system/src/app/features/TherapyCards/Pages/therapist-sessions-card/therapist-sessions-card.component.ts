import { Component, input, output } from '@angular/core';
import { TherapistSessionProgramDto } from '../../../Organization/Doctors/Models/therapists/therapist-session-program.dto';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-therapist-sessions-card',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './therapist-sessions-card.component.html',
  styleUrl: './therapist-sessions-card.component.css',
})
export class TherapistSessionsCardComponent {
  sessions = input.required<TherapistSessionProgramDto[]>();

  loading = input<boolean>(false);

  sessionClicked = output<TherapistSessionProgramDto>();
  onCardClick(session: TherapistSessionProgramDto): void {
    this.sessionClicked.emit(session);
  }
}
