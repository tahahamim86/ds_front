import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiagnosisService {

 private apiUrl = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) {}

  // Load reference image from assets, convert it to File format, and send it with new image
  braindiagnosis(image: File): Observable<any> {
    return new Observable(observer => {


          // Send both images
          const formData: FormData = new FormData();
          formData.append('image', image);


          this.http.post<any>(this.apiUrl+'classify/', formData).subscribe(
            response => {
              observer.next(response);
              observer.complete();
            },
            error => observer.error(error)
          );
        })
  
  }
  retinopathydiagnosis(image: File): Observable<any> {
    return new Observable(observer => {


          // Send both images
          const formData: FormData = new FormData();
          formData.append('image', image);


          this.http.post<any>(this.apiUrl+'classify_retinopathy/', formData).subscribe(
            response => {
              observer.next(response);
              observer.complete();
            },
            error => observer.error(error)
          );
        })
  
  }
  cardiologydiagnosis(image: File): Observable<any> {
    return new Observable(observer => {


          // Send both images
          const formData: FormData = new FormData();
          formData.append('image', image);


          this.http.post<any>(this.apiUrl+'cardiology_classify/', formData).subscribe(
            response => {
              observer.next(response);
              observer.complete();
            },
            error => observer.error(error)
          );
        })
  
  }
respiratorydiagnosis(image: File): Observable<any> {
    return new Observable(observer => {


          // Send both images
          const formData: FormData = new FormData();
          formData.append('image', image);


          this.http.post<any>(this.apiUrl+'respiratory_classify/', formData).subscribe(
            response => {
              observer.next(response);
              observer.complete();
            },
            error => observer.error(error)
          );
        })
  
  }
}
