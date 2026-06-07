import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

let isRefreshing = false;

export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const auth = inject(AuthService);
  const token = auth.accessToken();

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !isRefreshing && !req.url.includes('/auth/')) {
        isRefreshing = true;
        return inject(AuthService)
          ['http'].post<{ accessToken: string }>(
            '/api/auth/refresh',
            {},
            { withCredentials: true },
          )
          .pipe(
            switchMap((res) => {
              isRefreshing = false;
              auth.setToken(res.accessToken);
              return next(
                req.clone({
                  setHeaders: { Authorization: `Bearer ${res.accessToken}` },
                }),
              );
            }),
            catchError((refreshErr) => {
              isRefreshing = false;
              auth.clearSession();
              return throwError(() => refreshErr);
            }),
          );
      }
      return throwError(() => err);
    }),
  );
};
