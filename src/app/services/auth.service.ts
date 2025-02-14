import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  signUp(registerRequest: any): Observable<any> {
    return this.http.post(
      `${environment.urlServerApi}/auth/signup`,
      registerRequest
    );
  }

  signIn(authenticationRequest: any): Observable<any> {
    return this.http.post(
      `${environment.urlServerApi}/auth/signin`,
      authenticationRequest
    );
  }
  // Confirmation de la validation
  confirmValidation(code: string): Observable<any> {
    return this.http.get(
      `${environment.urlServerApi}/auth/confirm-validation`,
      { params: { code } } // Ajouter le code comme paramètre de requête
    );
  }
  // Demande de réinitialisation de mot de passe
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(
      `${environment.urlServerApi}/auth/request-reset`,
      null, // Pas de body pour cette requête
      { params: { email } } // Ajouter le paramètre email dans l'URL
    );
  }

  // Réinitialisation du mot de passe
  resetPassword(token: string, newPassword: string): Observable<any> {
    const resetPasswordRequest = { token, newPassword };
    return this.http.post(
      `${environment.urlServerApi}/auth/reset-password`,
      resetPasswordRequest
    );
  }
  // Confirm email
  confirmEmail(token: string): Observable<any> {
    return this.http.post(
      `${environment.urlServerApi}/auth/confirm-email`,
      null, // No body for this request
      { params: { token } } // Add token as a query parameter
    );
  }

  // getUserByEmail(email: String): Observable<User> {
  //   return this.http.get<User>(
  //     `${environment.urlServerApi}/users/email/${email}`
  //   ); // Log raw response
  // }
}
