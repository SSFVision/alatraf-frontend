export interface AssignIndustrialPartsRequest {
  assignments: IndustrialPartAssignmentItem[];
}
export interface IndustrialPartAssignmentItem {
  diagnosisIndustrialPartId: number;
  doctorId: number;
  sectionId: number;
}

