export interface RegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  authMethode?: string; // Champ facultatif
}
