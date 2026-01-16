export interface UpdateDoctorRequest {
  fullname: string;

  birthdate: string;

  phone: string;

  nationalNo: string;
  addressId: number;


  gender: boolean;

  specialization: string;
  departmentId: number;
}
