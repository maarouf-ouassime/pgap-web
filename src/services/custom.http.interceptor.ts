// import {HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
// import {Injectable} from '@angular/core';
// import {Router} from '@angular/router';
// import 'rxjs/add/observable/fromPromise';
// import {Observable} from 'rxjs';
// import 'rxjs/add/operator/do';
// import {TokenStorageService} from './token-storage.service';
//
// @Injectable()
// export class CustomHttpInterceptor implements HttpInterceptor {
//
//   constructor(private tokenStorageService: TokenStorageService, private router: Router) {
//   }
//
//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     // @ts-ignore
//     return Observable.fromPromise(this.handleAccess(request, next));
//   }
//
//   private async handleAccess(request: HttpRequest<any>, next: HttpHandler):
//     Promise<HttpEvent<any>> {
//     const authToken = await JSON.parse(<string>sessionStorage.getItem('auth-user'));
//     let changedRequest = request;
//     // HttpHeader object immutable - copy values
//     const headerSettings: { [name: string]: string | string[]; } = {};
//     for (const key of request.headers.keys()) {
//       // @ts-ignore
//       headerSettings[key] = request.headers.getAll(key);
//     }
//     if (authToken) {
//       const token = authToken.token;
//       headerSettings['Authorization'] = 'Bearer ' + token;
//     }
//
//     const newHeader = new HttpHeaders(headerSettings);
//
//     changedRequest = request.clone({
//       headers: newHeader
//     });
//
//     // @ts-ignore
//     return next.handle(changedRequest).do((event: HttpEvent<any>) => {
//       if (event instanceof HttpResponse) {
//         console.log(event);
//       }
//     }, (err: any) => {
//       if (err instanceof HttpErrorResponse) {
//         // console.log(err);
//         if (err.status === 401) {
//           console.log('interceptor invoked in 401 error');
//           this.tokenStorageService.signOut();
//           this.router.navigate(['login']).then(() => {
//             window.location.reload();
//           });
//           // window.location.reload();
//
//         } else if (err.status === 304) {
//           console.log('interceptor invoked in 304 error');
//           this.router.navigate(['login']).then(() => {
//             window.location.reload();
//           });
//         }
//       }
//     }).toPromise();
//   }
// }
