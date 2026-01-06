export interface UserDetailsDto {
  userId: string;
  username: string;
  isActive: boolean;
  roles: string[];
  permissions: string[];
}
