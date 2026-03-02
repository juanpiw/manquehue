import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

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
  private readonly apiBaseUrl =
    typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:4000'
      : '';
  private readonly accessTokenKey = 'imanquehue_access_token';
  private readonly refreshTokenKey = 'imanquehue_refresh_token';
  private readonly userKey = 'imanquehue_user';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<AuthApiData> {
    return this.http
      .post<AuthApiResponse>(`${this.apiBaseUrl}/api/dash-manquehue/auth/login`, credentials)
      .pipe(
        map((response) => response.data),
        tap((data) => this.persistSession(data))
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
