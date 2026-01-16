export interface CreateUserRequest {
  fullName: string;
  birthdate: string;
  phone: string;
  nationalNo?: string | null;
  addressId: number;
  gender: boolean;
  userName: string;
  password: string;
  isActive: boolean;

}
