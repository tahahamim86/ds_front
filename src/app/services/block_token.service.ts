import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class BlockTokenService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // Update as needed for production

  constructor(private http: HttpClient, private authService: AuthServiceService) {}

  /**
   * Checks if the current user (from AuthService) has an associated token
   */
  checkUserToken(): Observable<{ email: string; has_token: boolean }> {
    const email = this.authService.getUserId();
    if (!email) {
      return throwError(() => new Error('User email is not available.'));
    }

    return this.http.get<{ email: string; has_token: boolean }>(
      `${this.apiUrl}/check-token/${encodeURIComponent(email)}/`
    );
  }

  /**
   * Sets or updates the token for the current user
   */
  setUserToken(token: string): Observable<any> {
    const email = this.authService.getUserId();
    if (!email) {
      return throwError(() => new Error('User email is not available.'));
    }

    return this.http.post(`${this.apiUrl}/token/user/generate/`, {
      email: email,
      token: token
    });
  }

  /**
   * Fetches documents for the current user using the token
   */
  getUserDocs(token: string): Observable<any> {
    const email = this.authService.getUserId();
    if (!email) {
      return throwError(() => new Error('User email is not available.'));
    }

    const params = new HttpParams().set('token', token);
    return this.http.get(`${this.apiUrl}/user/${encodeURIComponent(email)}/documents/`, { params });
  }
}
