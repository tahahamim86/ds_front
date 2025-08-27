import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private baseUrl = 'http://127.0.0.1:9300/api/v1/registration';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {}

  /**
   * Logs in the user and stores JWT token in localStorage.
   */
  login(email: string, password: string): Observable<any> {
    return this.http.post<{ jwt: string }>(this.baseUrl + '/authenticate', { email, password }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      tap(response => {
        if (response.jwt) {
          this.storeToken(response.jwt);
          console.log('Stored JWT Token:', response.jwt);  // Log the JWT to confirm it's stored
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Registers a new user and stores JWT token in localStorage.
   */
register(email: string, password: string, firstName: string, lastName: string, role: string): Observable<string> {
  const registerUrl = `${this.baseUrl}`;
  const userData = {
    email,
    password,
    First_name: firstName,
    Last_name: lastName,
    app_user_role: role
  };

  return this.http.post(registerUrl, userData, {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    responseType: 'text' // <-- Tells Angular not to expect JSON
  }).pipe(
    tap(token => {
      if (token) {
        localStorage.setItem(this.tokenKey, token);  // Save UUID or token
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
    localStorage.removeItem(this.tokenKey);  // Remove the token from localStorage
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
    console.log(this.tokenKey)
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
      return true;  // Treat invalid token as expired
    }
  }

  /**
   * Decodes the JWT token to extract payload information.
   */
  private decodeToken(token: string): any {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));  // Decode the base64 payload
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
   * Retrieves the user ID from the JWT token.
   */
/**
 * Retrieves the user ID (or email) from the JWT token.
 */
getUserId(): string | null {
  const token = this.getToken();
  if (token) {
    const decodedToken = this.decodeToken(token);
    console.log('Decoded Token:', decodedToken);  // Log the decoded token to inspect the payload

    // Check if the decoded token has 'sub' (subject) field, which seems to be the user's email
    if (decodedToken && decodedToken.sub) {
      return decodedToken.sub;  // Use 'sub' as the user identifier (email in this case)
    } else {
      console.warn('No userId (sub) found in the token payload');
      return null;
    }
  }
  return null;
}

}
