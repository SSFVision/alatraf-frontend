export interface SectionDto {
  id: number;
  name: string;

  departmentId: number;
  departmentName: string;

  roomsCount?: number | null;
}
