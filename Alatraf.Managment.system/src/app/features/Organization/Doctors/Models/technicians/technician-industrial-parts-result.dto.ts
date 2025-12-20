import { TechnicianIndustrialPartDto } from './technician-industrial-part.dto';

export interface TechnicianIndustrialPartsResultDto {
  doctorSectionRoomId: number;

  doctorId: number;
  doctorName: string;

  sectionId: number;
  sectionName: string;

  date: string;

  items: TechnicianIndustrialPartDto[];
}
