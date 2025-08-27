
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = ' http://127.0.0.1:8000/api/chatbotchronique/';  // Your Django API endpoint

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<any> {
    const payload = { message: message }; // Format message in JSON
    return this.http.post<any>(this.apiUrl, payload);
  }
}
