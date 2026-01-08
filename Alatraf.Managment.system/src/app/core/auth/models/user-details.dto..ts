export interface UserDetailsDto {
  userId: string;
  username: string;
  isActive: boolean;
  roles: readonly string[];
  permissions: readonly string[];
}
