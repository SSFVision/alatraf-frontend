export interface CreateDoctorRequest {
  fullname: string;
  birthdate: string;
  phone: string;
  nationalNo: string;
  address: string;
  gender: boolean;
  specialization: string;
  departmentId: number;
}
