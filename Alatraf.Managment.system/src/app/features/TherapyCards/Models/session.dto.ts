import { SessionProgramDto } from './session-program.dto';

export interface SessionDto {
  sessionId: number;
  isTaken: boolean;
  number: number;
  sessionDate: string; // DateOnly → ISO string (yyyy-MM-dd)
  sessionPrograms: SessionProgramDto[];
}
