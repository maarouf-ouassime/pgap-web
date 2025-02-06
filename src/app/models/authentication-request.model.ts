// authentication-request.model.ts
export interface AuthenticationRequest {
  email: string;
  password?: string;
  verificationCode?: string; // Champ facultatif
  authMethode?: string; // Champ facultatif
}
