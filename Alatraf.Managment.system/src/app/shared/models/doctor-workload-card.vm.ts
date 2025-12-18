export interface DoctorWorkloadCardVM {
  id: number;               // doctorId
  name: string;             // doctorName
  todayCount: number;       // sessions OR industrial parts
  sectionName?: string | null;
  roomName?: string | null;
}
