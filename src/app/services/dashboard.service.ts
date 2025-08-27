import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://127.0.0.1:8000/api/extract/';  
  
  constructor(private http: HttpClient, private authService: AuthServiceService) {}

  // POST: To send image for extraction
  extractImage(image: File): Observable<any> {
    const userEmail = this.authService.getUserId();
    const formData = new FormData();
    formData.append('image', image, image.name);  
    const url = `${this.apiUrl}${userEmail}/`;
    return this.http.post<any>(url, formData);
  }

  // GET: To retrieve the extracted data for the current user
  getExtractedData(): Observable<any> {
    const userEmail = this.authService.getUserId();
    const url = `${this.apiUrl}${userEmail}/`;
    return this.http.get<any>(url);
  }

  // DELETE: To delete the extracted data for the current user
  deleteExtractedData(): Observable<any> {
    const userEmail = this.authService.getUserId();
    const url = `${this.apiUrl}${userEmail}/`;
    return this.http.delete<any>(url);
  }
}
