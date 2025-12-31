import { TechnicianDto } from '../../features/Organization/Doctors/Models/technicians/technician.dto';
import { TherapistDto } from '../../features/Organization/Doctors/Models/therapists/therapist.dto';
import { DoctorWorkloadCardVM } from '../../shared/models/doctor-workload-card.vm';

export function mapTherapistToDoctorWorkloadCardVM(
  dto: TherapistDto
): DoctorWorkloadCardVM {
  return {
    id: dto.doctorSectionRoomId!,
    name: dto.doctorName,
    todayCount: dto.todaySessions,
    sectionName: dto.sectionName,
    roomName: dto.roomName,
  };
}

export function mapTechnicianToDoctorWorkloadCardVM(
  dto: TechnicianDto
): DoctorWorkloadCardVM {
  return {
    id: dto.doctorSectionRoomId!,
    name: dto.doctorName,
    todayCount: dto.todayIndustrialParts,
    sectionName: dto.sectionName,
    roomName: null,
  };
}
