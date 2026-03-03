import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

interface AuthApiUser {
  id: number;
  email: string;
  displayName?: string;
}

interface AuthApiData {
  user: AuthApiUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface AuthApiResponse {
  success: boolean;
  data: AuthApiData;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiBaseUrl = this.resolveApiBaseUrl();
  private readonly accessTokenKey = 'imanquehue_access_token';
  private readonly refreshTokenKey = 'imanquehue_refresh_token';
  private readonly userKey = 'imanquehue_user';

  constructor(private http: HttpClient) {}

  private resolveApiBaseUrl(): string {
    if (typeof window === 'undefined') {
      return '';
    }

    const host = window.location.hostname.toLowerCase();

    // Local dev: use Angular proxy (/api -> localhost:4000)
    if (host === 'localhost' || host === '127.0.0.1') {
      return '';
    }

    // Production/staging frontend: call backend API host directly
    return 'https://www.api.thefutureagencyai.com';
  }

  login(credentials: { email: string; password: string }): Observable<AuthApiData> {
    const endpoint = `${this.apiBaseUrl}/api/dash-manquehue/auth/login`;
    console.log('[DashLogin] request', {
      endpoint,
      email: credentials.email
    });

    return this.http
      .post<AuthApiResponse>(endpoint, credentials)
      .pipe(
        tap((response) => {
          console.log('[DashLogin] response ok', {
            endpoint,
            success: response?.success === true
          });
        }),
        map((response) => response.data),
        tap((data) => this.persistSession(data)),
        catchError((error: HttpErrorResponse) => {
          const rawBody =
            typeof error?.error === 'string'
              ? error.error.slice(0, 200)
              : JSON.stringify(error?.error || {}).slice(0, 200);

          console.error('[DashLogin] response error', {
            endpoint,
            status: error?.status,
            statusText: error?.statusText,
            url: error?.url,
            rawBody
          });

          return throwError(() => error);
        })
      );
  }

  isLoggedIn(): boolean {
    return Boolean(localStorage.getItem(this.accessTokenKey));
  }

  logout(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userKey);
  }

  private persistSession(data: AuthApiData): void {
    localStorage.setItem(this.accessTokenKey, data.accessToken);
    localStorage.setItem(this.refreshTokenKey, data.refreshToken);
    localStorage.setItem(this.userKey, JSON.stringify(data.user));
  }
}
