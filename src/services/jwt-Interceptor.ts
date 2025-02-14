import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import {Observable, catchError, switchMap, throwError, finalize} from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import {NgToastService} from "ng-angular-popup";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private authService: AuthService,
              private router: Router,
              private toaster: NgToastService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('[JwtInterceptor] Intercepting request:', request.url);

    // Ne pas ajouter le token aux requêtes d'authentification
    if (request.url.includes('/api/v1/auth')) {
      console.log('[JwtInterceptor] Request to auth endpoint, bypassing token addition.');
      return next.handle(request);
    }
    if (request.url.includes('/api/v1/survey')) {
      console.log('[JwtInterceptor] Request to auth endpoint, bypassing token addition.');
      return next.handle(request);
    }
    if (request.url.includes('/api/v1/survey-response')) {
      console.log('[JwtInterceptor] Request to auth endpoint, bypassing token addition.');
      return next.handle(request);
    }
    if (request.url.includes('/api/v1/files')) {
      console.log('[JwtInterceptor] Request to auth endpoint, bypassing token addition.');
      return next.handle(request);
    }

    const accessToken = this.authService.getAccessToken();
    console.log('[JwtInterceptor] Access token:', accessToken);

    if (accessToken) {
      request = this.addToken(request, accessToken);
      console.log('[JwtInterceptor] Request updated with token:', request);
    }

    return next.handle(request).pipe(
      catchError(error => {
        console.log('[JwtInterceptor] Error occurred:', error);
        if (error instanceof HttpErrorResponse && error.status === 401) {
          console.log('[JwtInterceptor] Handling 401 Unauthorized error.');
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<unknown>, token: string | undefined): HttpRequest<unknown> {
    console.log('[JwtInterceptor] Adding token to request.');
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // private handle401Error(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  //   console.log('[JwtInterceptor] Handling 401 error, refreshing token...');
  //   if (!this.isRefreshing) {
  //     this.isRefreshing = true;
  //
  //     return this.authService.refreshToken().pipe(
  //       switchMap((resp) => {
  //         console.log('[JwtInterceptor] Token refreshed successfully:', resp.data?.accessToken);
  //         this.isRefreshing = false;
  //         return next.handle(this.addToken(request, resp.data?.accessToken));
  //       }),
  //       catchError((error) => {
  //         console.error('[JwtInterceptor] Token refresh failed, logging out user:', error);
  //         this.isRefreshing = false;
  //         this.authService.logout();
  //         this.router.navigate(['/authentication']);
  //         return throwError(() => error);
  //       })
  //     );
  //   }
  //   console.log('[JwtInterceptor] Another token refresh is already in progress.');
  //   return next.handle(request);
  // }


  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      return this.authService.refreshToken2().pipe(
        switchMap((resp) => {
          this.isRefreshing = false;
          if (resp.success) {
            this.toaster.info('Votre session a expiré. Un email de validation vous a été envoyé.', 'Validation requise');
            setTimeout(() => this.router.navigate(['/authentication']), 3000);
            return throwError(() => new Error('Redirection vers login nécessaire'));
          } else {
            //this.handleAuthenticationFailure(resp.message);
            return throwError(() => new Error(resp.message || 'Token validation failed'));
          }
        }),
        catchError((error) => {
          console.error('[JwtInterceptor] Token validation failed:', error);
          //this.handleAuthenticationFailure('Erreur lors de la validation du token');
          return throwError(() => error);
        }),
        finalize(() => {
          this.isRefreshing = false;
        })
      );
    }

    return next.handle(request);
  }

  private handleAuthenticationFailure(message?: string) {
    this.isRefreshing = false;
    this.authService.logout();

    // Afficher l'erreur
    this.toaster.warning(
      message || 'Impossible de renouveler votre session. Veuillez vous reconnecter.',
      'Erreur d\'authentification',
      3000
    );

    setTimeout(() => {
      // Rediriger vers la page de validation
      this.router.navigate(['/authentication']);
    }, 3000);
  }



}
