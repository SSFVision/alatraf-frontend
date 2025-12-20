import { TherapistSessionProgramDto } from './therapist-session-program.dto';

export interface TherapistTodaySessionsResultDto {
  doctorSectionRoomId: number;

  doctorId: number;
  doctorName: string;

  sectionId: number;
  sectionName: string;

  roomId: number;
  roomName: string;

  /** DateOnly from backend */
  date: string;

  items: TherapistSessionProgramDto[];
}
