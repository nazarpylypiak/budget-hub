import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import type {
  LoginDto,
  RegisterDto,
  AuthResponseDto,
} from '@budget-hub/shared-types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _accessToken = signal<string | null>(
    localStorage.getItem('access_token'),
  );

  readonly isAuthenticated = computed(() => !!this._accessToken());
  readonly accessToken = this._accessToken.asReadonly();

  login(dto: LoginDto) {
    return this.http.post<AuthResponseDto>('/api/auth/login', dto).pipe(
      tap((res) => {
        this._accessToken.set(res.accessToken);
        localStorage.setItem('access_token', res.accessToken);
      }),
    );
  }

  register(dto: RegisterDto) {
    return this.http.post<AuthResponseDto>('/api/auth/register', dto).pipe(
      tap((res) => {
        this._accessToken.set(res.accessToken);
        localStorage.setItem('access_token', res.accessToken);
      }),
    );
  }

  logout() {
    return this.http
      .post('/api/auth/logout', {})
      .pipe(tap(() => this.clearSession()));
  }

  setToken(token: string) {
    this._accessToken.set(token);
    localStorage.setItem('access_token', token);
  }

  clearSession() {
    this._accessToken.set(null);
    localStorage.removeItem('access_token');
    this.router.navigate(['/auth/login']);
  }
}
