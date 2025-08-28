import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'environment';  // Import environment

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private baseUrl = `${environment.apiUrl}/v1/registration`;  // Use environment API URL
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {}

  /**
   * Logs in the user and stores JWT token in localStorage.
   */
  login(email: string, password: string): Observable<any> {
    return this.http.post<{ jwt: string }>(`${this.baseUrl}/authenticate`, { email, password }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      tap(response => {
        if (response.jwt) {
          this.storeToken(response.jwt);
          console.log('Stored JWT Token:', response.jwt);
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Registers a new user and stores JWT token in localStorage.
   */
  register(email: string, password: string, firstName: string, lastName: string, role: string): Observable<any> {
    const userData = {
      email,
      password,
      First_name: firstName,
      Last_name: lastName,
      app_user_role: role
    };

    // Adjust responseType as needed (JSON or text)
    return this.http.post<{ jwt: string }>(this.baseUrl, userData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      // responseType: 'text' // <-- Uncomment if backend returns plain text token
    }).pipe(
      tap(response => {
        if (response && 'jwt' in response) {
          this.storeToken(response.jwt);
        } else if (typeof response === 'string') {
          // If response is a plain token string (text)
          this.storeToken(response);
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Handles authentication errors.
   */
  private handleError(error: any) {
    console.error('Authentication Error:', error);
    let errorMessage = 'Server Error';

    if (error.status === 400) {
      errorMessage = '⚠️ Bad Request: Invalid input data.';
    } else if (error.status === 401) {
      errorMessage = '🚫 Unauthorized: Invalid credentials.';
    } else if (error.status === 403) {
      errorMessage = '❌ Forbidden: Access denied.';
    } else if (error.status === 500) {
      errorMessage = '⚠️ Internal Server Error. Please try again later.';
    }

    return throwError(() => new Error(errorMessage));
  }

  /**
   * Logs out the user by removing the token.
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    console.log('Logged out successfully');
  }

  /**
   * Checks if the user is authenticated by verifying if the token is valid.
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.isTokenExpired(token) : false;
  }

  /**
   * Retrieves the stored JWT token.
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Stores the JWT token securely.
   */
  private storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Checks if the JWT token is expired.
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      return !payload.exp || Date.now() >= payload.exp * 1000;
    } catch (e) {
      console.warn('Invalid Token:', e);
      return true;
    }
  }

  /**
   * Decodes the JWT token to extract payload information.
   */
  private decodeToken(token: string): any {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (e) {
      console.warn('Error decoding token:', e);
      return null;
    }
  }

  /**
   * Returns authorization headers with the JWT token.
   */
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return token
      ? new HttpHeaders({ 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' })
      : new HttpHeaders();
  }

  /**
   * Refreshes the JWT token.
   */
  refreshToken(): Observable<any> {
    const token = this.getToken();
    if (!token) return throwError(() => new Error('No token available'));

    return this.http.post<{ jwt: string }>(`${this.baseUrl}/refresh`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(response => {
        if (response.jwt) {
          this.storeToken(response.jwt);
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves the user ID (or email) from the JWT token.
   */
  getUserId(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.decodeToken(token);
      if (decodedToken && decodedToken.sub) {
        return decodedToken.sub;
      } else {
        console.warn('No userId (sub) found in the token payload');
        return null;
      }
    }
    return null;
  }
}

