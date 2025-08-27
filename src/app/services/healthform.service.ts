import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class HealthFormService {
  private apiUrl = 'http://127.0.0.1:8000/api/form';

  constructor(
    private http: HttpClient,
    private authService: AuthServiceService
  ) {}

  // Create a new HealthForm
  createHealthForm(formData: any): Observable<any> {
    const url = `${this.apiUrl}/user/${formData.app_user}/`;
    return this.http.post<any>(url, formData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // Get health forms for the current authenticated user
  getHealthForms(): Observable<any> {
    const userEmail = this.authService.getUserId();
    const url = `${this.apiUrl}/user/${userEmail}/`;
    return this.http.get<any>(url);
  }

  // Update the health form for the current authenticated user
  updateHealthForm(formData: any): Observable<any> {
    const userEmail = this.authService.getUserId();
    const url = `${this.apiUrl}/user/${userEmail}/`;
    return this.http.put<any>(url, formData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // Delete the health form for the current authenticated user
  deleteHealthForm(): Observable<any> {
    const userEmail = this.authService.getUserId();
    const url = `${this.apiUrl}/user/${userEmail}/`;
    return this.http.delete<any>(url);
  }
}
