import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthServiceService } from './auth-service.service';  // Import AuthServiceService
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DiagnosisManagementService {
  private apiUrl = 'http://127.0.0.1:9300/api/diagnosis';  // Your API endpoint

  constructor(
    private http: HttpClient,
    private authService: AuthServiceService  // Inject AuthServiceService
  ) {}

  // Get all diagnoses
  getAllDiagnoses(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addDiagnosis(formData: FormData): Observable<any> {
    // Log debug info
    const image = formData.get('image');
    console.log("Image Type:", (image as File)?.type);
    console.log("Image instance of File:", image instanceof File);
  
    // Check image validity again (optional)
    if (!(image instanceof File)) {
      return throwError(() => new Error('Invalid image file'));
    }
  
    return this.http.post(`${this.apiUrl}/add`, formData);
  }
  
  // Get a specific diagnosis by ID
  getDiagnosisById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Delete a diagnosis by ID
  deleteDiagnosis(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { responseType: 'text' });
  }

  getDiagnosesByUserEmail(email: string): Observable<any> {
    // Define the type for the response
 
          return this.http.get(`${this.apiUrl}/user/${email}`);
  }
  
  
}
