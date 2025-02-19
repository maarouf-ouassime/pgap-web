// reset-password-request.model.ts
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
