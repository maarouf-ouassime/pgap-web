// authentication-response.model.ts
export interface AuthenticationResponse {
  accessToken?: string;
  refreshToken?: string;
  authMethode?: string; // Champ facultatif
  secretImageUri?: string; // Champ facultatif
}
