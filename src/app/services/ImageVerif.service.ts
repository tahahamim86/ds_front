import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageVerifService {
  private apiUrl = 'http://127.0.0.1:8000/api/resize-and-compare/';

  constructor(private http: HttpClient) {}
  
  VerifImageChest(imageB: File): Observable<any> {
    return new Observable(observer => {
      fetch('assets/images/respiratory.png')
        .then(response => response.blob())  
        .then(blob => {
          const imageA = new File([blob], 'respiratory.png', { type: 'image/png' });

          const formData: FormData = new FormData();
          formData.append('imageA', imageA);
          formData.append('imageB', imageB);

          this.http.post<any>(this.apiUrl, formData).subscribe(
            response => {
              observer.next(response);
              observer.complete();
            },
            error => observer.error(error)
          );
        })
        .catch(error => observer.error(error));
    });
  }
  VerifImageBrainIrm(imageB: File): Observable<any> {
    return new Observable(observer => {
      fetch('assets/images/respiratory.png')
        .then(response => response.blob())  
        .then(blob => {
          const imageA = new File([blob], 'brain.jpg', { type: 'image/jpg' });

          const formData: FormData = new FormData();
          formData.append('imageA', imageA);
          formData.append('imageB', imageB);

          this.http.post<any>(this.apiUrl, formData).subscribe(
            response => {
              observer.next(response);
              observer.complete();
            },
            error => observer.error(error)
          );
        })
        .catch(error => observer.error(error));
    });
  }
  VerifImageRetinopathy(imageB: File): Observable<any> {
    return new Observable(observer => {
      fetch('assets/images/retinopath.png')
        .then(response => response.blob())  
        .then(blob => {
          const imageA = new File([blob], 'brain.jpg', { type: 'image/png' });

          const formData: FormData = new FormData();
          formData.append('imageA', imageA);
          formData.append('imageB', imageB);

          this.http.post<any>(this.apiUrl, formData).subscribe(
            response => {
              observer.next(response);
              observer.complete();
            },
            error => observer.error(error)
          );
        })
        .catch(error => observer.error(error));
    });
  }
}
