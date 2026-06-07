import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
  HttpClient,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs';
import { AuthService } from '../auth/auth.service';

let isRefreshing = false;
const refreshSubject = new BehaviorSubject<string | null>(null);

export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const auth = inject(AuthService);
  const http = inject(HttpClient);
  const token = auth.accessToken();

  const withToken = (t: string) =>
    req.clone({ setHeaders: { Authorization: `Bearer ${t}` } });

  const authReq = token ? withToken(token) : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status !== 401 || req.url.includes('/auth/')) {
        return throwError(() => err);
      }

      if (isRefreshing) {
        return refreshSubject.pipe(
          filter((t): t is string => t !== null),
          take(1),
          switchMap((t) => next(withToken(t))),
        );
      }

      isRefreshing = true;
      refreshSubject.next(null);

      return http
        .post<{ accessToken: string }>(
          '/api/auth/refresh',
          {},
          { withCredentials: true },
        )
        .pipe(
          switchMap((res) => {
            isRefreshing = false;
            auth.setToken(res.accessToken);
            refreshSubject.next(res.accessToken);
            return next(withToken(res.accessToken));
          }),
          catchError((refreshErr) => {
            isRefreshing = false;
            refreshSubject.next(null);
            auth.clearSession();
            return throwError(() => refreshErr);
          }),
        );
    }),
  );
};
