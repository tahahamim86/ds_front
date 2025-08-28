import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthServiceService } from './auth-service.service';
import { environment } from '../environments/environment';  // Import environment

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/profile`;  // Use environment API URL

  constructor(private http: HttpClient, private authService: AuthServiceService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return token
      ? new HttpHeaders({ 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' })
      : new HttpHeaders();
  }

  getProfile(): Observable<any> {
    const email = this.authService.getUserId();
    if (!email) {
      return throwError(() => new Error('User email not found in token'));
    }

    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/email/${email}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  updateProfile(updatedProfile: any, imageFile?: File | null): Observable<any> {
    const email = this.authService.getUserId();
    if (!email) {
      return throwError(() => new Error('User email not found in token'));
    }

    const formData = new FormData();

    // Append all properties from updatedProfile to FormData
    for (const key in updatedProfile) {
      if (updatedProfile.hasOwnProperty(key)) {
        formData.append(key, updatedProfile[key]);
      }
    }

    if (imageFile) {
      formData.append('image', imageFile, imageFile.name);
    }

    console.log('FormData contents (updateProfile) before request:');
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken() ?? ''}`
      // Note: Do NOT set 'Content-Type' when sending FormData; the browser will set it.
    });

    return this.http.put<any>(`${this.apiUrl}/update/${email}`, formData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  createProfile(newProfile: any, imageFile?: File | null): Observable<any> {
    const formData = new FormData();

    formData.append('fullName', newProfile.fullName);
    formData.append('birthday', newProfile.birthday);
    formData.append('placeBirth', newProfile.placeBirth);
    formData.append('gender', newProfile.gender);
    formData.append('identityMatricule', newProfile.identityMatricule);
    formData.append('codeNam', newProfile.codeNam);
    formData.append('contacttype', newProfile.contacttype);
    formData.append('contactInfo', newProfile.contactInfo);
    formData.append('martialstatus', newProfile.martialstatus);
    formData.append('description_martialstatus', newProfile.description_martialstatus);
    formData.append('nationality', newProfile.nationality);
    formData.append('email', newProfile.email);

    if (imageFile) {
      formData.append('image', imageFile, imageFile.name);
    }

    console.log('FormData contents (createProfile) before request:');
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken() ?? ''}`
      // 'Content-Type' omitted intentionally for FormData
    });

    return this.http.post<any>(`${this.apiUrl}/add`, formData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  deleteProfile(): Observable<any> {
    const email = this.authService.getUserId();
    if (!email) {
      return throwError(() => new Error('User email not found in token'));
    }

    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.apiUrl}/delete/${email}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<any> {
    console.error('An error occurred:', error);
    let errorMessage = 'Unknown error occurred. Please try again later.';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Network error: ${error.error.message}`;
    } else if (error.status === 400) {
      errorMessage = 'Bad Request: Missing required parameters.';
    } else if (error.status === 404) {
      errorMessage = 'Not Found: The requested profile does not exist.';
    } else if (error.status === 500) {
      errorMessage = 'Server error: Please contact support.';
    }

    console.log('Error Message:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
