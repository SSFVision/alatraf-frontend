export interface ServiceDto {
  serviceId: number;
  name: string;
  departmentId: number;
  department: string;
  price: number | null;
}

export interface CreateUpdateServiceDto {
  name: string;
  departmentId: number;
  department: string;
  price: number | null;
}
