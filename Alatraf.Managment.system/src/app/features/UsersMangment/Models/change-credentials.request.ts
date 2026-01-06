export interface ChangeCredentialsRequest {
  oldPassword: string;
  newPassword?: string;
  newUsername?: string;
}
