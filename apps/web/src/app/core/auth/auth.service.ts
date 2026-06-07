import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import type { LoginDto, RegisterDto, AuthResponseDto } from '@budget-hub/shared-types';

interface StoredUser { id: string; email: string; name: string; householdId: string; }

function loadUser(): StoredUser | null {
  try { return JSON.parse(localStorage.getItem('user') ?? 'null'); } catch { return null; }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _accessToken = signal<string | null>(localStorage.getItem('access_token'));
  private readonly _user = signal<StoredUser | null>(loadUser());

  readonly isAuthenticated = computed(() => !!this._accessToken());
  readonly accessToken = this._accessToken.asReadonly();
  readonly user = this._user.asReadonly();

  login(dto: LoginDto) {
    return this.http.post<AuthResponseDto>('/api/auth/login', dto).pipe(
      tap((res) => this.persist(res)),
    );
  }

  register(dto: RegisterDto) {
    return this.http.post<AuthResponseDto>('/api/auth/register', dto).pipe(
      tap((res) => this.persist(res)),
    );
  }

  logout() {
    return this.http.post('/api/auth/logout', {}).pipe(tap(() => this.clearSession()));
  }

  setToken(token: string) {
    this._accessToken.set(token);
    localStorage.setItem('access_token', token);
  }

  clearSession() {
    this._accessToken.set(null);
    this._user.set(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
  }

  private persist(res: AuthResponseDto) {
    this._accessToken.set(res.accessToken);
    this._user.set(res.user);
    localStorage.setItem('access_token', res.accessToken);
    localStorage.setItem('user', JSON.stringify(res.user));
  }
}
