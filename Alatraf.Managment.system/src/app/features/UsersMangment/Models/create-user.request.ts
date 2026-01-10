export interface CreateUserRequest {
  fullName: string;
  birthdate: string;
  phone: string;
  nationalNo?: string | null;
  address: string;
  gender: boolean;
  userName: string;
  password: string;
  isActive: boolean;
}
