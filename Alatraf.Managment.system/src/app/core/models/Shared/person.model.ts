export interface PersonDto {
  personId: number;
  fullname: string;
  birthdate?: string;
  phone?: string;
  nationalNo?: string;
  address?: string;
  gender: string;
  autoRegistrationNumber?: string | null;
  addressId?: number;
}
