// auth.service.ts
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {environment} from "../environments/environment";
import {RegisterRequest} from "../app/models/register-request.model";
import {AuthenticationResponse} from "../app/models/authentication-response.model";
import {VerificationRequest} from "../app/models/verification-request.model";
import {User} from "../app/models/user.model";
import {AuthenticationRequest} from "../app/models/authentication-request.model";
import {ApiResponse} from "../app/models/api-responce-model";
import {ResetPasswordRequest} from "../app/models/reset-password-request.model";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessTokenSubject = new BehaviorSubject<string | null>(null);

  httpOptions;
  header = {
    'Content-Type': 'application/json',
    //'Access-Control-Allow-Headers': 'Content-Type',
    //'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT',
   // 'Access-Control-Allow-Origin': environment.originUrl
  };

  constructor(private http: HttpClient) {
    this.accessTokenSubject.next(localStorage.getItem('accessToken'));
    this.httpOptions = new HttpHeaders(this.header);
  }

  register(request: RegisterRequest): Observable<ApiResponse<AuthenticationResponse>> {
    return this.http.post<ApiResponse<AuthenticationResponse>>(`${environment.urlServerApi}/auth/register`, request);
  }

  login(credentials: AuthenticationRequest): Observable<ApiResponse<AuthenticationResponse>> {
    return this.http.post<ApiResponse<AuthenticationResponse>>(environment.urlServerApi + '/auth/authenticate', credentials).pipe(
      tap(response => this.storeTokens(response.data!))
    );
  }

  refreshToken(): Observable<ApiResponse<AuthenticationResponse>> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<ApiResponse<AuthenticationResponse>>(
      environment.urlServerApi +
      '/auth/refresh-token',
      {},
      { headers: { Authorization: `Bearer ${refreshToken}` } }
    ).pipe(
      tap(response => this.storeTokens(response.data!))
    );
  }

  refreshToken2(): Observable<ApiResponse<AuthenticationResponse>> {
    const accessToken = localStorage.getItem('accessToken');
    return this.http.post<ApiResponse<AuthenticationResponse>>(
      `${environment.urlServerApi}/auth/refresh-token2`,
      { accessToken },  // Envoyer sous forme d'objet
      { headers: { 'Content-Type': 'application/json' } }
    );
  }


  private storeTokens(tokens: AuthenticationResponse): void {
    localStorage.setItem('accessToken', tokens.accessToken || '');
    //localStorage.setItem('refreshToken', tokens.refreshToken || '');
    this.accessTokenSubject.next(tokens.accessToken || '');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // getRefreshToken(): string | null {
  //   return localStorage.getItem('refreshToken');
  // }

  logout(): void {
    localStorage.removeItem('accessToken');
    //localStorage.removeItem('refreshToken');
    this.accessTokenSubject.next(null);
  }

  verifyEmail(request : VerificationRequest): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${environment.urlServerApi}/auth/verify-email`, request);
  }

  getUserByEmail(email: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${environment.urlServerApi}/auth/email/${email}`);
  }

  sendEmailCodeLogin(request: AuthenticationRequest): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${environment.urlServerApi}/auth/send-email-code-login`, request);
  }

  getQrCodeAppAuthentification(email: string): Observable<ApiResponse<string>> {
    return this.http.get<ApiResponse<string>>(`${environment.urlServerApi}/auth/qrCode/${email}`);
  }

  getMessageOuassime(): Observable<ApiResponse<string>> {
    return this.http.get<ApiResponse<string>>(`${environment.urlServerApi}/test/Ouassime`, {headers: this.httpOptions});
  }

  // Demande de réinitialisation
  forgotPassword(email: string): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${environment.urlServerApi}/auth/forgot-password`,
      { email }
    );
  }

// Soumission du nouveau mot de passe
  resetPassword(request: ResetPasswordRequest): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${environment.urlServerApi}/auth/reset-password`,
      request
    );
  }

}
